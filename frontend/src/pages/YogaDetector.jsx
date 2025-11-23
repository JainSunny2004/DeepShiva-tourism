import React, { useState, useRef, useEffect } from 'react'
import { YogaPoseDetector } from '../lib/yogaDetector'

export default function YogaDetector() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [detector, setDetector] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [currentPose, setCurrentPose] = useState(null)
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    const poseDetector = new YogaPoseDetector()
    setDetector(poseDetector)

    return () => {
      if (detector) {
        detector.stop()
      }
    }
  }, [])

  const startDetection = async () => {
    if (!detector) return

    const initialized = await detector.initialize()
    if (!initialized) {
      alert('Failed to initialize pose detector')
      return
    }

    setIsActive(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        detector.detectPose(videoRef.current, (poseData) => {
          setCurrentPose(poseData.pose)
          setFeedback(poseData.feedback)

          if (canvasRef.current && poseData.landmarks) {
            detector.drawLandmarks(canvasRef.current, poseData.landmarks)
          }
        })
      }
    } catch (error) {
      console.error('Camera access failed:', error)
      alert('Please allow camera access')
    }
  }

  const stopDetection = () => {
    if (detector) {
      detector.stop()
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }

    setIsActive(false)
    setCurrentPose(null)
    setFeedback([])
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        🧘 Yoga Pose Detection
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Real-time AI-powered yoga pose detection and feedback using your camera
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          <nvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full"
            style={{ transform: 'scaleX(-1)' }}
          />

          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center text-white">
                <p className="text-xl mb-4">Camera not active</p>
                <button
                  onClick={startDetection}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Detection
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detected Pose
              </h3>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {currentPose || 'None'}
              </p>
            </div>

            {isActive && (
              <button
                onClick={stopDetection}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Stop
              </button>
            )}
          </div>

          {feedback.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded p-4">
              <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                💡 Feedback:
              </h4>
              <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                {feedback.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2"><strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure good lighting for best results</li>
              <li>Position yourself fully in frame</li>
              <li>Wear contrasting clothing for better detection</li>
              <li>Hold poses for at least 3 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
