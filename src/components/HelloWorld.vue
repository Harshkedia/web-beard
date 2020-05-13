<template>
  <div>
    <canvas ref="face" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
import ml5 from "ml5";
import DrawingFunctions from "@/lib/DrawingFunctions";

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
      detections: null,
      environment: null
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
      this.video = await this.getVideo();

      this.faceapi = ml5.faceApi(
        this.video,
        this.detection_options,
        this.modelReady
      );
      this.environment = DrawingFunctions.setupEnvironment();
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
      const detections = result;

      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.drawImage(this.video, 0, 0, this.canvasWidth, this.canvasHeight);

      if (detections) {
        if (detections.length > 0) {
          DrawingFunctions.drawLandmarks(this.ctx, detections);
        }
      }
      DrawingFunctions.tick(this.environment);
      setTimeout(this.faceapi.detect(this.gotResults), 20);
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
