
const allThreads = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
let selectedThreads = [];
let selectedPatch;

const next = () =>{
  console.log('selected threads ' + selectedThreads + ' and patch ' + selectedPatch)
  window.location.href='game.html';
};

const checkIfReady = () => {
  const button = document.getElementById('btn-continue');
  if (selectedThreads.length === 4 && selectedPatch) {
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

const find = (arr, number) => arr.find(element => element === number);
const greyOutThreads = () => allThreads.forEach(
  (thread) => {
    if (!find(selectedThreads, thread)) {
      // console.log('greyout ' + thread)
      document.getElementById('btn-' + thread).classList.add('disabled');
    }
    return
  }
)
const greyInThreads = () => allThreads.forEach(
  (thread) => {
    if (!find(selectedThreads, thread)) {
      // console.log('greyin ' + thread)
      document.getElementById('btn-' + thread).classList.remove('disabled');
    }
    return
  }
)

const toggleSelectThread = (number) => {
  //limit ammount of threads here

  checkIfReady();
  if (selectedThreads.length < 4) {
    if (find(selectedThreads, number)) {
      document.getElementById("btn-" + number).classList.remove('active');
      const index = selectedThreads.indexOf(number);
      if (index > -1) {
        selectedThreads.splice(index, 1);
      }

      if (selectedThreads.length < 4) {
        greyInThreads();
      };

      checkIfReady();
      console.log('deselected ' + number)
      console.log('threads selected ' + selectedThreads)
    } else {
      document.getElementById("btn-" + number).classList.add('active');
      selectedThreads.push(number);

      if (selectedThreads.length == 4) {
        greyOutThreads()
      }

      checkIfReady();
      console.log('selected ' + number)
      console.log('threads selected ' + selectedThreads)
    }
  } else {
    greyOutThreads();
    if (find(selectedThreads, number)) {
      document.getElementById("btn-" + number).classList.remove('active');
      const index = selectedThreads.indexOf(number);
      if (index > -1) {
        selectedThreads.splice(index, 1);
      }

      if (selectedThreads.length < 4) {
        greyInThreads();
      };

      checkIfReady();
      console.log('deselected ' + number)
      console.log('threads selected ' + selectedThreads)
    }
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