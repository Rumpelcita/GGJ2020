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
var color = 0;
var palette = 0;
var pmap = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];

//  Sprite Preview
var preview;
var previewBG;
var data;
var bitmapData;


function resetData() {

    data = [];

    for (var y = 0; y < spriteHeight; y++)
    {
        var a = [];

        for (var x = 0; x < spriteWidth; x++)
        {
            a.push(' ');
        }

        data.push(a);
    }
}

function dataToBitmap() {
    var x;
    bitmapData = [];

    for (var y = 0; y < data.length; y++) {
        x = data[y].join('');
        bitmapData.push(x);
    }

    game.state.start('patching_preload');
}


function createUI() {

    //  Create some icons
    var arrow = [
        '  22  ',
        ' 2222 ',
        '222222',
        '  22  ',
        '  22  '
    ];

    var disk = [
        'DDDDDDDDDD',
        'DED1111DED',
        'DED1111DDD',
        'DEDDDDDDED',
        'DEEEEEEEED',
        'DEFFFFFFED',
        'DEFF222FED',
        'DEFF222FED',
        'DEFF222FED',
        'DDDDDDDDDD'
    ];

    game.create.texture('arrow', arrow, 2);
    game.create.texture('save', disk, 4);

    game.create.grid('uiGrid', 32 * 16, 32, 32, 32, 'rgba(255,255,255,0.5)');

    ui = game.make.bitmapData(800, 32);

    drawPalette();

    ui.addToWorld();

    var style = { font: "20px Courier", fill: "#fff", tabs: 80 };

    paletteArrow = game.add.sprite(8, 36, 'arrow');

    saveIcon = game.add.sprite(600, 550, 'save');
    saveIcon.inputEnabled = true;
    saveIcon.input.useHandCursor = true;
    saveIcon.events.onInputDown.add(dataToBitmap, this);
}

function createDrawingArea() {

    game.create.grid('drawingGrid', 16 * canvasZoom, 16 * canvasZoom, canvasZoom, canvasZoom, 'rgba(161, 159, 143, 0.6)');

    canvas = game.make.bitmapData(spriteWidth * canvasZoom, spriteHeight * canvasZoom);
    canvasBG = game.make.bitmapData(canvas.width + 2, canvas.height + 2);

    canvasBG.rect(0, 0, canvasBG.width, canvasBG.height, '#DEDDCB');
    canvasBG.rect(1, 1, canvasBG.width - 2, canvasBG.height - 2, '#DEDDCB');

    var x = 10;
    var y = 64;

    canvasBG.addToWorld(x, y);
    canvasSprite = canvas.addToWorld(x + 1, y + 1);
    canvasGrid = game.add.sprite(x + 1, y + 1, 'drawingGrid');
    canvasGrid.crop(new Phaser.Rectangle(0, 0, spriteWidth * canvasZoom, spriteHeight * canvasZoom));
}

function refresh() {

    //  Update Canvas
    canvas.clear();

    for (var y = 0; y < spriteHeight; y++) {
        for (var x = 0; x < spriteWidth; x++) {
            var i = data[y][x];

            if (i !== ' ') {
                color = game.create.palettes[palette][i];
                canvas.rect(x * canvasZoom, y * canvasZoom, canvasZoom, canvasZoom, color);
            }
        }
    }
}

function createEventListeners() {

    game.input.mouse.capture = true;
    game.input.onDown.add(onDown, this);
    game.input.onUp.add(onUp, this);
    game.input.addMoveCallback(paint, this);

}

function cls() {
    resetData();
    refresh();
}

function drawPalette() {

    //  Draw the palette to the UI bmd
    ui.clear(0, 0, 32 * 16, 32);

    var x = 0;

    for (var clr in game.create.palettes[palette]) {
        ui.rect(x, 0, 32, 32, game.create.palettes[palette][clr]);
        x += 32;
    }

    ui.copy('uiGrid');

}

function changePalette() {

    palette++;

    if (!game.create.palettes[palette]) {
        palette = 0;
    }

    drawPalette();
    refresh();

}

function setColor(i, p) {

    if (typeof p !== 'undefined') {
        //  It came from a Keyboard Event, in which case the color index is in p, not i.
        i = p;
    }

    if (i < 0) {
        i = 15;
    } else if (i >= 16) {
        i = 0;
    }

    colorIndex = i;
    color = game.create.palettes[palette][pmap[colorIndex]];

    paletteArrow.x = (i * 32) + 8;

}

function nextColor() {

    var i = colorIndex + 1;
    setColor(i);

}

function prevColor() {

    var i = colorIndex - 1;
    setColor(i);

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

    var x1 = game.math.snapToCeil(pointer.x - canvasSprite.x, canvasZoom) / canvasZoom;
    var y1 = game.math.snapToCeil(pointer.y - canvasSprite.y, canvasZoom) / canvasZoom;

    //  Get the grid loc from the pointer
    var x2 = game.math.snapToFloor(pointer.x - canvasSprite.x, canvasZoom) / canvasZoom;
    var y2 = game.math.snapToFloor(pointer.y - canvasSprite.y, canvasZoom) / canvasZoom;


    if (x1 < 0 || x1 > spriteWidth || y1 < 0 || y1 > spriteHeight) {
        return;
    }

    if (!isDown) {
        return;
    }

    if (isErase) {
        data[y2][x2] = ' ';
        canvas.clear(x1 * canvasZoom, y1 * canvasZoom, canvasZoom, canvasZoom, color);
    } else {
        data[y2][x2] = pmap[colorIndex];
        canvas.line(x1 * canvasZoom, y1 * canvasZoom, x2 * canvasZoom, y2 * canvasZoom, color, 3);
        canvas.line(x2 * canvasZoom, y1 * canvasZoom, x1 * canvasZoom, y2 * canvasZoom, color, 3);
    }
}

function patch() {
    game.state.start('patching');
}


var preload = {
    preload: function(){

    },

    create: function(){

    },

    update: function(){
        if ('arrow' in game.cache.image &&
            'save' in game.cache.image
        ) {
            game.state.start('stitching');
        }

    }
}

var patching = {
    preload: function(){

    },

    create: function(){

    },

    update: function(){

    }
}

var stitching = {
    preload: function(){

    },

    create: function(){
        //   So we can right-click to erase
        document.body.oncontextmenu = function() { return false; };

        Phaser.Canvas.setUserSelect(game.canvas, 'none');
        Phaser.Canvas.setTouchAction(game.canvas, 'none');

        game.stage.backgroundColor = '#ebf2f5';

        resetData();

        createUI();
        createDrawingArea();
        createEventListeners();

        setColor(1);

    },

    update: function(){

    }
}

var patching_preload = {
    preload: function(){
        game.create.texture(bitmapData, 'saved_patch', 16);
    },

    create: function(){
    },

    update: function(){
        if (Phaser.Cache.checkImageKey('saved_patch')){
            game.state.start('patching');
        }

    }
}

var patching = {
    preload: function(){
        game.create.texture(bitmapData, 'saved_patch', 16);
    },

    create: function(){
        game.load.start();
        paletteArrow = game.add.sprite(8, 36, 'saved_patch');
    },

    update: function(){

    }
}