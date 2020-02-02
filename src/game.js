//  Dimensions
var spriteWidth = 16;
var spriteHeight = 16;

//  UI
var ui;
var paletteArrow;

//  Drawing Area
var canvas;
var canvasBG;
var canvasGrid;
var canvasSprite;
var canvasZoom = 32;

//  Keys + Mouse
var keys;
var isDown = false;
var isErase = false;

//  Palette
var ci = 0;
var palette = 0;

//  Sprite Preview
var preview;
var previewBG;
var data;
var bitmapData;

// Threads
var thread_size;

var thread_limits = {
    'bat': 24
};

function resetData() {

    data = [];

    for (var y = 0; y < spriteHeight; y++) {
        var a = [];

        for (var x = 0; x < spriteWidth; x++) {
            a.push(' ');
        }

        data.push(a);
    }
}

function createDrawingArea() {
    var x = (768 - (16*canvasZoom)) / 2;
    var y = (768 - (16*canvasZoom)) / 2;

    game.create.grid('drawingGrid', 16 * canvasZoom, 16 * canvasZoom, canvasZoom, canvasZoom, 'rgba(161, 159, 143, 0.6)');

    canvas = game.make.bitmapData(spriteWidth * canvasZoom, spriteHeight * canvasZoom);

    bg_patch = game.add.sprite(x+1, y+1, 'patch');
    //bg_patch.tint = 'rgba(239, 211, 0, 0.6)';
    bg_patch.alpha = 0.3;

    canvasSprite = canvas.addToWorld(x + 1, y + 1);
    canvasGrid = game.add.sprite(x + 1, y + 1, 'drawingGrid');
    canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));
}

function refresh() {
    //  Update Canvas
    canvas.clear();
}

function createEventListeners() {

    game.input.mouse.capture = true;
    game.input.onDown.add(onDown, this);
    game.input.onUp.add(onUp, this);
    game.input.addMoveCallback(paint, this);

}

function setThreadLimits() {
    var color;
    for (var clr in threads) {
        color = clr['color']; 

        thread_size[color] += clr['ammount'];

        console.log('thread_size:' + thread_size);
    }
}

function onDown(pointer) {

    if (pointer.y <= 32) {
        setColor(game.math.snapToFloor(pointer.x, 32) / 32);
    } else {
        isDown = true;

        if (pointer.rightButton.isDown) {
            isErase = true;
        } else {
            isErase = false;
        }

        paint(pointer);
    }

}

function onUp() {
    isDown = false;
}

function paint(pointer) {
    var colorIndex = document.querySelector('input[name="colors"]:checked').value;
    var color = game.create.palettes[palette][colorIndex];

    //var amount = thread_size[colorIndex]; 
    //console.log('amount:' + thread_size);

    var x1 = game.math.snapToCeil(pointer.x - canvasSprite.x, canvasZoom) / canvasZoom;
    var y1 = game.math.snapToCeil(pointer.y - canvasSprite.y, canvasZoom) / canvasZoom;

    //  Get the grid loc from the pointer
    var x2 = game.math.snapToFloor(pointer.x - canvasSprite.x, canvasZoom) / canvasZoom;
    var y2 = game.math.snapToFloor(pointer.y - canvasSprite.y, canvasZoom) / canvasZoom;


    if (x1 < 0 || x1 > spriteWidth || y1 < 0 || y1 > spriteHeight) {
        return;
    }

    if (x1 == x2 || y1 == y2){
        return;
    }

    if (!isDown) {
        return;
    }

    if (isErase) {
        data[y2][x2] = ' ';
        console.log('test')
        console.log(data[y2][x2])
        canvas.clear(x2 * canvasZoom, y2 * canvasZoom, canvasZoom, canvasZoom, color);
    } else {
        //if (amount > 0) {
            data[y2][x2] = colorIndex;
            console.log(data);
            canvas.line(x1 * canvasZoom, y1 * canvasZoom, x2 * canvasZoom, y2 * canvasZoom, color, 3);
            canvas.line(x2 * canvasZoom, y1 * canvasZoom, x1 * canvasZoom, y2 * canvasZoom, color, 3);
        //}
    }
}

function mergeColorData(colorStatus) {
    var merged_colors = [];

    for(var i = 0; i < colorStatus.length; i++)
    {
        merged_colors = merged_colors.concat(colorStatus[i]);
    }

    return merged_colors
}

function formatBitmapString(bitmapData){
    var formattedData = [];

    for (var y = 0; y < data.length; y++) {
        for (var x = 0; x < data.length; x++){
            if (bitmapData[y][x] != ' '){
                bitmapData[y][x] = 'x'
            }
        }

        xx = data[y].join('');
        formattedData.push(xx);
    }

    return formattedData.join("\n");
}

var stitching = {
    preload: function(){
        //game.load.bitmapFont('stitch_font', 'assets/fonts/UbuntuMono-Bold.png', 'assets/fonts/UbuntuMono-Bold.fnt');
        game.load.image('patch', "assets/patches/patch_" + patch + "_large.png");
    },

    create: function(){
        //   So we can right-click to erase
        document.body.oncontextmenu = function() { return false; };

        Phaser.Canvas.setUserSelect(game.canvas, 'none');
        Phaser.Canvas.setTouchAction(game.canvas, 'none');

        game.stage.backgroundColor = '#fff';

        resetData();

        createDrawingArea();
        createEventListeners();

        //setThreadLimits();

    },

    update: function(){

    }
}

var patching = {
    preload: function(){
        
    },

    create: function(){
        var merged_colors = mergeColorData(data);

        var bmpMessage = formatBitmapString(data);

        console.log(bmpMessage);

        //bmpText = game.add.bitmapText(10, 100, 'stitch_font', bmpMessage ,34);

        var bmpText = game.add.text(game.world.centerX, game.world.centerY, bmpMessage);

        bmpText.font = 'ubuntu_monobold';

        for (var color = 0; color < merged_colors.length; color++) {
            var realColor = game.create.palettes[palette][merged_colors[color]];
            bmpText.addColor(realColor, color);
        }

        bmpText.inputEnabled = true;
    
        bmpText.input.enableDrag();   
    },

    update: function(){

    }
}