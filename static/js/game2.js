let model;

async function loadModel() {
    console.log('Loading handpose model...');
    model = await handpose.load();
    console.log('Handpose model loaded');
}

loadModel();

async function detectHands() {
  if (model) {
      const predictions = await model.estimateHands(videoElement);
      if (predictions.length > 0) {
          // Do something with the detected hands...
      }
  }
}
