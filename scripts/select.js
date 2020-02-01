const allThreads = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
let selectedThreads = [];
let selectedPatch;
var game = new Phaser.Game(768, 768, Phaser.CANVAS, 'game-container');

const parameters = () => { threads = selectedThreads; patch = selectedPatch };
const startStitching = () => { game.state.start('stitching'); };

game.state.add('stitching', stitching);
game.state.add('patching_preload', patching_preload);
game.state.add('patching', patching);
game.state.add('parameters', { preload: parameters, update: startStitching });

const initializePaserGame = () => {
  game.state.start('parameters');

  return
};

const next = () => {
  console.log('selected threads')
  console.log(selectedThreads)
  console.log('and patch ' + selectedPatch);
  document.getElementById('main-container').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');
  initializePaserGame();
};

const checkIfReady = () => {
  const button = document.getElementById('btn-continue');

  if (!checkAmmounts() && selectedPatch) {
    button.classList.remove('disabled');
    console.log('ready')
  } else {
    console.log('not ready :(')
    if (!button.classList.contains('disabled')) {
      button.classList.add('disabled');
    }
  }
  return
}

checkAmmounts = () => {
  let ammount = 0;

  selectedThreads.forEach(function (arrayItem) {
    ammount = arrayItem.ammount + ammount;
  });

  return ammount < 4
}

const find = (arr, obj) => arr.find(element => element.color === obj.color);

const greyOutThreads = () => allThreads.forEach(
  (thread) => {
    if (!find(selectedThreads, thread)) {
      document.getElementById('btn-' + thread).classList.add('disabled');
    }
    return
  }
);

const greyInThreads = () => allThreads.forEach(
  (thread) => {
    if (!find(selectedThreads, thread)) {
      document.getElementById('btn-' + thread).classList.remove('disabled');
    }
    return
  }
);

const deselectThread = (colorCode) => {

  const colorObj = find(selectedThreads, { color: colorCode });
  colorObj.ammount = colorObj.ammount - 1;

  if (colorObj.ammount == 0) {
    document.getElementById("btn-" + colorCode + '-selected').classList.add('hidden');
    const index = selectedThreads.indexOf(colorObj);

    if (index > -1) {
      selectedThreads.splice(index, 1);
    }
  } else {
    document.getElementById("btn-" + colorCode + '-selected').innerHTML = colorObj.ammount;
  };

  console.log(selectedThreads)
  if (checkAmmounts()) {
    greyInThreads();
  };
}

const selectThread = (colorCode) => {
  //limit ammount of threads here

  checkIfReady();

  if (checkAmmounts()) {
    let colorObj = { color: colorCode };

    if (find(selectedThreads, colorObj)) {
      colorObj = find(selectedThreads, colorObj);
      colorObj.ammount = colorObj.ammount + 1;
      document.getElementById("btn-" + colorCode + '-selected').innerHTML = colorObj.ammount;

      if (!checkAmmounts()) {
        greyOutThreads();
      }

      checkIfReady();
      console.log('selected ' + colorCode)
      console.log('threads selected ')
      console.log(selectedThreads)

    } else {
      document.getElementById("btn-" + colorCode + '-selected').classList.remove('hidden');
      colorObj.ammount = 1;
      document.getElementById("btn-" + colorCode + '-selected').innerHTML = colorObj.ammount;

      selectedThreads.push(colorObj);

      if (!checkAmmounts()) {
        greyOutThreads();
      }

      checkIfReady();
      console.log('selected ' + colorCode)
      console.log('threads selected ')
      console.log(selectedThreads)
    }
  } else {
    greyOutThreads();
    checkIfReady();
  }
}

const toggleSelectPatch = (patch) => {
  if (!selectedPatch) {
    selectedPatch = patch;
    checkIfReady();

    if (selectedPatch) {
      document.getElementById("slider-controls").classList.add('hidden');
      document.getElementById("btn-patch-" + patch).innerHTML = 'selected patch ' + selectedPatch;
    }
  } else {
    selectedPatch = null;
    checkIfReady();

    if (!selectedPatch) {
      document.getElementById("slider-controls").classList.remove('hidden');
      document.getElementById("btn-patch-" + patch).innerHTML = 'select patch ' + patch;
    }
  }
  console.log('selected patch ' + selectedPatch)
}