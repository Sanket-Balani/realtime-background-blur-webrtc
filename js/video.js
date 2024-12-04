import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
const videoElement = document.getElementById('video');
const canvas = document.getElementById('canvas');

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const blurBtn = document.getElementById('blur-btn');
const unblurBtn = document.getElementById('unblur-btn');

const ctx = canvas.getContext('2d');

startBtn.addEventListener('click', e => {
  startBtn.disabled = true;
  stopBtn.disabled = false;

  unblurBtn.disabled = false;
  blurBtn.disabled = false;

  startVideoStream();
});

stopBtn.addEventListener('click', e => {
  startBtn.disabled = false;
  stopBtn.disabled = true;

  unblurBtn.disabled = true;
  blurBtn.disabled = true;

  unblurBtn.hidden = true;
  blurBtn.hidden = false;

  videoElement.hidden = false;
  canvas.hidden = true;

  stopVideoStream();
});

blurBtn.addEventListener('click', e => {
  blurBtn.hidden = true;
  unblurBtn.hidden = false;

  videoElement.hidden = true;
  canvas.hidden = false;

  loadBodyPix();
});

unblurBtn.addEventListener('click', e => {
  blurBtn.hidden = false;
  unblurBtn.hidden = true;

  videoElement.hidden = false;
  canvas.hidden = true;
});

videoElement.onplaying = () => {
  canvas.height = videoElement.videoHeight;
  canvas.width = videoElement.videoWidth;
};

function startVideoStream() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
      videoElement.srcObject = stream;
      videoElement.play();
    })
    .catch(err => {
      startBtn.disabled = false;
      blurBtn.disabled = true;
      stopBtn.disabled = true;
      alert(`Following error occured: ${err}`);
    });
}

function stopVideoStream() {
  const stream = videoElement.srcObject;

  stream.getTracks().forEach(track => track.stop());
  videoElement.srcObject = null;
}


async function loadBodyPix() {
  const net = await bodyPix.load();
  options = {
    multiplier: 0.75,
    stride: 32,
    quantBytes: 4
  }
  bodyPix.load(options)
    .then(net => perform(net))
    .catch(err => console.log(err))
  startVideo(net);
}
async function startVideo(net) {
  // Access the video element
  const video = document.getElementById('video');

  // Get a video stream from the webcam
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  // Function to perform segmentation on a single frame
  const performSegmentation = async () => {
    const performSegmentation = async () => {
      const segmentation = await net.segment(video);
    
      // Access and process segmentation data
      const maskData = await segmentation.data();
    
      // Create a new canvas element for processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
    
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    
      // Draw the original video frame onto the canvas
      ctx.drawImage(video, 0, 0);
    
      // Create a new image data object from the canvas data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
      // Loop through each pixel of the image data
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Get the corresponding value from the mask data (assuming grayscale mask)
        const maskValue = maskData[i / 4];
    
        // Apply a threshold to determine background pixels (adjust threshold as needed)
        const isBackground = maskValue < 128;
    
        // Blur background pixels using a weighted average (replace with your preferred blur algorithm)
        if (isBackground) {
          const blurAmount = 5; // Adjust blur amount as needed (higher = more blur)
          imageData.data[i] = applyBlur(imageData.data, i, blurAmount); // Red channel
          imageData.data[i + 1] = applyBlur(imageData.data, i + 1, blurAmount); // Green channel
          imageData.data[i + 2] = applyBlur(imageData.data, i + 2, blurAmount); // Blue channel
        }
      }
    
      // Update the canvas data with the modified image data
      ctx.putImageData(imageData, 0, 0);
    
      // Draw the blurred image onto the video element (replace with your preferred display method)
      video.getContext('2d').drawImage(canvas, 0, 0);
    
      // Request another frame for segmentation
      requestAnimationFrame(performSegmentation);
    };
    
    // Helper function to apply a simple blur effect (replace with a more robust blur algorithm if needed)
    function applyBlur(data, index, blurAmount) {
      let sum = 0;
      let count = 0;
      for (let i = -blurAmount; i <= blurAmount; i++) {
        const pixelIndex = index + i * 4;
        if (pixelIndex >= 0 && pixelIndex < data.length) {
          sum += data[pixelIndex];
          count++;
        }
      }
      return Math.floor(sum / count);
    }
    
  };

  // Start processing frames
  performSegmentation();
}

async function perform(net) {

  while (startBtn.disabled && blurBtn.hidden) {
    const segmentation = await net.segmentPerson(video);

    const backgroundBlurAmount = 6;
    const edgeBlurAmount = 2;
    const flipHorizontal = true;

    bodyPix.drawBokehEffect(
      canvas, videoElement, segmentation, backgroundBlurAmount,
      edgeBlurAmount, flipHorizontal);
  }
}
window.onload = loadBodyPix;
