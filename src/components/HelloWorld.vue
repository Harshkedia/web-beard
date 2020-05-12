/* eslint-disable no-underscore-dangle */ /* eslint-disable no-underscore-dangle
*/
<template>
  <div>
    <canvas ref="face" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
import ml5 from "ml5";
// import p5 from "p5";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      canvasWidth: 800,
      canvasHeight: 500,
      video: null,
      detection_options: {
        withLandmarks: true,
        withDescriptors: false
      },
      faceapi: null,
      detections: null
    };
  },
  computed: {
    constraints() {
      return { video: true };
    },
    canvas() {
      return this.$refs.face;
    },
    ctx() {
      return this.canvas.getContext("2d");
    }
  },
  created() {
    this.make();
  },
  methods: {
    async make() {
      // get the video
      this.video = await this.getVideo();

      this.faceapi = ml5.faceApi(
        this.video,
        this.detection_options,
        this.modelReady
      );
    },
    modelReady() {
      console.log("ready!");
      this.faceapi.detect(this.gotResults);
    },
    gotResults(err, result) {
      if (err) {
        console.log(err);
        return;
      }

      // console.log(result)
      const detections = result;

      // Clear part of the canvas
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.ctx.drawImage(this.video, 0, 0, this.canvasWidth, this.canvasHeight);

      if (detections) {
        if (detections.length > 0) {
          this.drawLandmarks(detections);
        }
      }
      this.faceapi.detect(this.gotResults);
    },
    drawLandmarks(detections) {
      for (let i = 0; i < detections.length; i++) {
        const { mouth } = detections[i].parts;
        const { nose } = detections[i].parts;
        const { leftEye } = detections[i].parts;
        const { rightEye } = detections[i].parts;
        const { rightEyeBrow } = detections[i].parts;
        const { leftEyeBrow } = detections[i].parts;

        this.drawPart(nose, false);
        this.drawPart(mouth, true);
        this.drawPart(leftEye, true);
        this.drawPart(leftEyeBrow, false);
        this.drawPart(rightEye, true);
        this.drawPart(rightEyeBrow, false);
      }
    },
    drawPart(feature, closed) {
      this.ctx.beginPath();
      for (let i = 0; i < feature.length; i++) {
        const x = feature[i]._x;
        const y = feature[i]._y;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      if (closed === true) {
        this.ctx.closePath();
      }
      this.ctx.stroke();
    },
    async getVideo() {
      // Grab elements, create settings, etc.
      const videoElement = document.createElement("video");
      videoElement.setAttribute("style", "display: none;");
      videoElement.width = this.canvasWidth;
      videoElement.height = this.canvasHeight;
      document.body.appendChild(videoElement);

      // Create a webcam capture
      const capture = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      videoElement.srcObject = capture;
      videoElement.play();

      return videoElement;
    },
    startVideo() {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(stream => {
          this.video = document.querySelector("video");
          this.video.srcObject = stream;
          this.video.onloadedmetadata = () => {
            this.video.play();
            this.addVideo();
          };
        })
        .catch(err => {
          console.log(err);
        });
    },
    addVideo() {
      this.ctx.drawImage(this.video, 0, 0, this.canvasWidth, this.canvasHeight);
      setTimeout(this.addVideo, 20);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
