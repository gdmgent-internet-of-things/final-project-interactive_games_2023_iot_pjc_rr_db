// Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const clear = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const savePic = document.getElementById('savePic');
const hiddenCanvas = document.getElementById('hiddenCanvas');
const hiddenContext = hiddenCanvas.getContext('2d');

// Drawing variables
let drawing = false;
let lastX = 0;
let lastY = 0;

// Color variable
let currentColor = colorPicker.value;

// Get access to the camera
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        video.play();
    });
}

// Drawing function
function draw(e) {
    if(!drawing) return;
    context.strokeStyle = currentColor;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Event listeners
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

// Clear canvas
clear.addEventListener('click', () => context.clearRect(0, 0, canvas.width, canvas.height));

// Color picker
colorPicker.addEventListener('input', (e) => currentColor = e.target.value);

// Save Picture
savePic.addEventListener('click', function() {
    // Draw the current video frame onto the hidden canvas
    hiddenContext.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
    // Then draw the drawn art onto the hidden canvas
    hiddenContext.drawImage(canvas, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    let dataURL = hiddenCanvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.href = dataURL;
    link.download = 'myImage.png';
    link.click();
});