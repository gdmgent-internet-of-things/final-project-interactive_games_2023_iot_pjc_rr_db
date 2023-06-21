// Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const clear = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const savePic = document.getElementById('savePic');
const hiddenCanvas = document.getElementById('hiddenCanvas');
const hiddenContext = hiddenCanvas.getContext('2d');
const stroke = document.getElementById('stroke');

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

// Existing Drawing function
function draw(e) {
    if(!drawing) return;
    context.strokeStyle = currentColor;
    context.lineWidth = stroke.value;
    context.beginPath();
    context.moveTo(lastX, lastY);

    context.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
    
    context.stroke();
}

// Event listeners
canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
});

canvas.addEventListener('pointermove', draw);

canvas.addEventListener('pointerup', () => drawing = false);
canvas.addEventListener('pointerout', () => drawing = false);

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

const prompts = [
    "Draw a moustache!",
    "Draw a pair of glasses!",
    "Can you draw a hat?",
    "Draw a beard!",
    "Draw a crown!",
    "Draw a pair of earrings!",
    "Draw a necklace!",
    "Draw a pair of sunglasses!",
    "Draw a tie!",
    "Draw some clouds and a sun!",
];

window.onload = function() {
    const promptElement = document.getElementById('prompt');
    const randomIndex = Math.floor(Math.random() * prompts.length);
    promptElement.textContent = prompts[randomIndex];
}

const freeze = document.getElementById('freeze');
const unfreeze = document.getElementById('unfreeze');

freeze.addEventListener('click', () => {
    video.pause();
});

unfreeze.addEventListener('click', () => {
    video.play();
});
