/*
UPDATE 03/30/2017 I found this block of code that make canvas paint works in mobile devices. I do not know how it works, but it works xD. This block code comes from Emma's Paint Project https://www.sololearn.com/Profile/1769383 so all credits for her.
*/
/*
UPDATE 03/31/2017 Now you can apply a blur brush effect.
*/
// Variables DOM
var canvas = document.getElementById('canvas');
var radiusPoint = document.getElementById('radiusPoint');
var radiusBlur = document.getElementById('radiusBlur');
var radTextRaduis = document.getElementById('radTextRaduis');
var radTextBlur = document.getElementById('radTextBlur');
var radioColors = document.getElementsByName('radioColors');
var saveCanvas = document.getElementById('saveCanvas');
var clearCanvas = document.getElementById('clearCanvas');
// Variable for touch mobile
var arr_touches = [];
// Set variables for color brush
var colorsLength = radioColors.length;
var i = 0;
// Default radio brush and blur
var radius = 10;
var blur = 0;
// Variables draw canvas
var draggin = false;
var ctx = canvas.getContext('2d');
// Initiating canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = radius * 2;
ctx.strokeStyle = '#111111';
ctx.fillStyle = '#111111';
ctx.shadowColor = '#111111';
// Seting radius brush
var setRadiusPoint = function(newRadius) {
  radius = newRadius;
  ctx.lineWidth = radius * 2;
};
// Seting radius blur
var setRadiusBlur = function(newBlur) {
  blur = newBlur;
  ctx.shadowBlur = blur;
};
// Seting colors brush and blur
var changeColor = function(newColor) {
  // console.log("New color is: " + newColor);
  ctx.strokeStyle = newColor;
  ctx.fillStyle = newColor;
  ctx.shadowColor = newColor;
};
var selectColors = function(e) {
  var selectColor = e.target;
  changeColor(selectColor.value);
};

// Clear canvas
function clearImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// Drawing canvas
var engage = function(e) {
  draggin = true;
  putPoint(e);
};
var disengage = function() {
  draggin = false;
  ctx.beginPath();
};
var putPoint = function(e) {
  if(draggin) {
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }
};
// Functions canvas mobile touch
function handleStart(evt) {
  var touches = evt.changedTouches;
  for(var i = 0; i < touches.length; i++) {
    if(isValidTouch(touches[i])) {
      evt.preventDefault();
      arr_touches.push(copyTouch(touches[i]));
      ctx.beginPath();
      ctx.fill();
    }
  }
}
function handleTouchMove(evt) {
  var touches = evt.changedTouches;
  var offset = findPos(canvas);
  for (var i = 0; i < touches.length; i++) {
    if(isValidTouch(touches[i])) {
      evt.preventDefault();
      var idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        ctx.lineTo(touches[i].clientX-offset.x, touches[i].clientY-offset.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(touches[i].clientX-offset.x, touches[i].clientY-offset.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(arr_touches[idx].clientX-offset.x, arr_touches[idx].clientY-offset.y);
        arr_touches.splice(idx, 1, copyTouch(touches[i]));
      }   
    }
  }
}
function handleEnd(evt) {
  var touches = evt.changedTouches;
  var offset = findPos(canvas);
  for (var i = 0; i < touches.length; i++) {
    if(isValidTouch(touches[i])) {
      evt.preventDefault();
      var idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        ctx.beginPath();
        ctx.moveTo(arr_touches[idx].clientX-offset.x, arr_touches[idx].clientY-offset.y);
        ctx.lineTo(touches[i].clientX-offset.x, touches[i].clientY-offset.y);
        arr_touches.splice(i, 1);
      } 
    }
  }
}
function handleCancel(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    arr_touches.splice(i, 1);
  }
}
function copyTouch(touch) {
  return {identifier: touch.identifier,clientX: touch.clientX,clientY: touch.clientY};
}
function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < arr_touches.length; i++) {
    var id = arr_touches[i].identifier;
    if (id == idToFind) {
      return i;
    }
  }
  return -1;
}
function isValidTouch(touch) {
  var curleft = 0, curtop = 0;
  var offset = 0;
  if (canvas.offsetParent) {
    do {
      curleft += canvas.offsetLeft;
      curtop += canvas.offsetTop;
    } while (touch == canvas.offsetParent);
    offset = { x: curleft-document.body.scrollLeft, y: curtop-document.body.scrollTop };
  }
  if(touch.clientX-offset.x > 0 &&
    touch.clientX-offset.x < parseFloat(canvas.width) &&
    touch.clientY-offset.y >0 &&
    touch.clientY-offset.y < parseFloat(canvas.height)) {
    return true;
  }else {
    return false;
  }
}
function findPos(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj == obj.offsetParent);
    return { x: curleft-document.body.scrollLeft, y: curtop-document.body.scrollTop };
  }
}
// Handling events listeners
radiusPoint.addEventListener('input', function() {
  radTextRaduis.innerHTML = radiusPoint.value;
  setRadiusPoint(this.value);
});
radiusBlur.addEventListener('input', function() {
  radTextBlur.innerHTML = radiusBlur.value;
  setRadiusBlur(this.value);
});
for (i = 0; i < colorsLength; i++) {
  // console.log("Elemento de indice " + i + " tiene value " + radioColors[i].value);
  radioColors[i].addEventListener('change', selectColors);
}
clearCanvas.addEventListener('click', clearImage);
canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mouseup', disengage);
canvas.addEventListener('mousemove', putPoint);

// Handling mobile touch events
canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchcancel", handleCancel, false);
canvas.addEventListener("touchleave", handleEnd, false);
canvas.addEventListener("touchmove", handleTouchMove, false);


// Select the save button
const saveButton = document.getElementById('saveCanvas');

// Set the click event for the save button to download the image as a PNG file
saveButton.addEventListener('click', () => {
  // Get the data URL for the image
  const dataURL = canvas.toDataURL('image/png');

  // Create an anchor element
  const link = document.createElement('a');

  // Set the href attribute to the data URL
  link.href = dataURL;

  // Set the download attribute to a file name
  link.download = 'ursapaint.png';

  // Append the anchor element to the document
  document.body.appendChild(link);

  // Click the anchor element to trigger the download
  link.click();

  // Remove the anchor element from the document
  document.body.removeChild(link);
});


// Select the bucket tool button
const bucketTool = document.getElementById('bucket-tool');

// Set the click event for the bucket tool to fill the canvas with the current brush color
bucketTool.addEventListener('click', () => {
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Initialize the canvas state array
const canvasStates = [];

// Function to save the current canvas state
function saveCanvasState() {
  canvasStates.push(canvas.toDataURL());
}

// Function to restore the previous canvas state
function restoreCanvasState() {
  if (canvasStates.length > 0) {
    const canvasState = canvasStates.pop();
    const image = new Image();
    image.src = canvasState;
    image.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    };
  }
}

// Add event listener for keydown events
document.addEventListener('keydown', function(event) {
  // Check if the Ctrl key and the Z key are pressed at the same time
  if (event.ctrlKey && event.key === 'z') {
    // Undo the last action
    restoreCanvasState();
  }
});

// Add event listener for mousedown events
canvas.addEventListener('mousedown', function(event) {
  // Save the current canvas state before making any changes
  saveCanvasState();

  // ...
});


// Function to remove the dot from the canvas
function removeDot() {
  // ...
}

// Function to restore the previous canvas state
function restoreCanvasState() {
  if (canvasStates.length > 0) {
    const canvasState = canvasStates.pop();
    const image = new Image();
    image.src = canvasState;
    image.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    };
  }
}

// Add event listener for keydown events
document.addEventListener('keydown', function(event) {
  // Check if the Ctrl key and the Z key are pressed at the same time
  if (event.ctrlKey && event.key === 'z') {
    // Remove the dot from the canvas
    removeDot();

    // Undo the last action
    restoreCanvasState();
  }
});

// Add event listener for mousedown events
canvas.addEventListener('mousedown', function(event) {
  // Save the current canvas state before making any changes
  saveCanvasState();

  // Add the dot to the canvas
  addDot();
});