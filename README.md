# WebRTC Background Blur

**A Proof-of-Concept for Real-Time Background Blurring**

Real-time background blur for WebRTC video calls, optimized for low-latency and resource-efficient performance.

This repository demonstrates a proof-of-concept for real-time background blurring in video conferences using WebRTC and TensorFlow.js. It's designed for potential integration with the Apache OpenMeetings app during Google Summer of Code (GSoC) 2024.

## Features

* Leverages WebRTC for capturing and streaming video.
* Employs TensorFlow.js and BodyPix for human segmentation.
* Applies a basic blur effect to the segmented background in real-time.
* Provides user controls for starting, stopping, and toggling background blur.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sanket-Balani/webrtc-background-blur.git
   ```
2. **Install dependencies:**
   This project requires TensorFlow.js and BodyPix. Follow the installation instructions on their respective websites:
   * TensorFlow.js: [https://www.tensorflow.org/js/tutorials/setup](https://www.tensorflow.org/js/tutorials/setup)
   * BodyPix: [https://www.npmjs.com/package/@tensorflow-models/body-pix](https://www.npmjs.com/package/@tensorflow-models/body-pix)
3. **Run the application:**
   Open `index.html` in your web browser. You'll be prompted to grant access to your webcam.

## Further Development

This is a basic PoC. Potential improvements include:

* Implementing a more robust blur algorithm for better visual quality.
* Exploring alternative body segmentation models.
* Optimizing performance for low-latency video processing.
* Integrating with the Apache Open Meetings app.

## License

This project is licensed under the MIT License.

## Contributing

We welcome contributions to enhance this project. Feel free to fork the repository, add features, and submit pull requests.
