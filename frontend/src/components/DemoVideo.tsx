'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DemoVideoProps {
  className?: string;
}

export default function DemoVideo({ className = '' }: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Video Thumbnail/Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative group cursor-pointer ${className}`}
        onClick={openModal}
      >
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster="/api/placeholder/800/450"
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-opacity-100 transition-all duration-300"
            >
              <PlayIcon className="w-8 h-8 text-gray-900 ml-1" />
            </motion.button>
          </div>

          {/* Video Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-lg font-semibold mb-1">
              SolarSense Demo
            </h3>
            <p className="text-white text-sm opacity-90">
              Watch our comprehensive demo showcasing all features
            </p>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              5:30
            </span>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-6xl bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 text-white" />
                ) : (
                  <PlayIcon className="w-6 h-6 text-white ml-1" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="w-5 h-5 text-white" />
                ) : (
                  <SpeakerWaveIcon className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
              </button>

              <div className="flex-1 h-1 bg-white bg-opacity-20 rounded-full mx-4">
                <div className="h-full bg-white rounded-full" style={{ width: '30%' }} />
              </div>

              <span className="text-white text-sm font-mono">
                2:15 / 5:30
              </span>
            </div>

            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[80vh]"
              controls={false}
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
