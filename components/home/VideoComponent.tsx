import React, { useState, useRef } from 'react';
import styles from './VideoComponent.module.scss';

interface VideoComponentProps {
  src: string;
  poster?: string;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ src, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((e) => {
          setError('Failed to play video. Please try again.');
          console.error('Video playback error:', e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleError = () => {
    setError('Failed to load video. Please check the source.');
  };

  return (
    <div className={styles.videoContainer}>
      {error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            className={`${styles.video} ${styles.noControls}`}
            onClick={togglePlayPause}
            onError={handleError}
            loop
            muted
            poster={poster} 
            controls={false}
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate"
          />
          <button className={styles.playPauseButton}
          style = {{
            opacity: isPlaying ? '0.1' : '1',
            // paddingLeft: !isPlaying ? '0.3rem' : 0
          }}
          onClick={togglePlayPause}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
        </>
      )}
    </div>
  );
};

export default VideoComponent;
