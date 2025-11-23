import * as tf from '@tensorflow/tfjs'
import { Pose } from '@mediapipe/pose'

export class YogaPoseDetector {
  constructor() {
    this.pose = null
    this.isInitialized = false
  }

  async initialize() {
    try {
      await tf.ready()
      
      this.pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        }
      })

      this.pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })

      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize pose detector:', error)
      return false
    }
  }

  async detectPose(videoElement, callback) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    this.pose.onResults((results) => {
      if (results.poseLandmarks) {
        const pose = this.analyzePose(results.poseLandmarks)
        callback(pose)
      }
    })

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await this.pose.send({ image: videoElement })
      },
      width: 640,
      height: 480
    })

    camera.start()
  }

  analyzePose(landmarks) {
    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]
    const leftHip = landmarks[23]
    const rightHip = landmarks[24]
    const leftKnee = landmarks[25]
    const rightKnee = landmarks[26]

    const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y)
    const hipAlignment = Math.abs(leftHip.y - rightHip.y)

    let detectedPose = 'Unknown'
    let feedback = []

    if (shoulderAlignment < 0.05 && hipAlignment < 0.05) {
      detectedPose = 'Mountain Pose (Tadasana)'
      feedback.push('Good alignment!')
    } else if (shoulderAlignment > 0.1) {
      feedback.push('Adjust shoulder alignment')
    }

    if (leftKnee.y < leftHip.y || rightKnee.y < rightHip.y) {
      detectedPose = 'Warrior Pose'
    }

    return {
      pose: detectedPose,
      feedback,
      landmarks,
      confidence: 0.85
    }
  }

  drawLandmarks(canvas, landmarks) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    landmarks.forEach((landmark) => {
      ctx.beginPath()
      ctx.arc(
        landmark.x * canvas.width,
        landmark.y * canvas.height,
        5,
        0,
        2 * Math.PI
      )
      ctx.fillStyle = '#10B981'
      ctx.fill()
    })
  }

  stop() {
    if (this.pose) {
      this.pose.close()
    }
  }
}

class Camera {
  constructor(videoElement, config) {
    this.video = videoElement
    this.config = config
  }

  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: this.config.width, height: this.config.height }
    })
    
    this.video.srcObject = stream
    this.video.play()

    const processFrame = async () => {
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        await this.config.onFrame()
      }
      requestAnimationFrame(processFrame)
    }

    this.video.addEventListener('loadeddata', () => {
      processFrame()
    })
  }
}
