import React, { useState } from 'react';
import Waveform from '../Waveform';
import { Header } from './Header';
import styles from './MobileHeader.module.scss';

const MobileHeader: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const isExerciseMode = true;

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <Header
          size="s"
          setShowTopScores={() => {}}
          showTopScores={false}
          showDashboard={false}
          showProfile={false}
          showLanguageDropdown={false}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          isExercise={isExerciseMode}
          showLogo={false}
          hideAuthBox={true}
          isMobile={true}
        />

        <div className={styles.waveformContainer}>
          <Waveform audioUrl="/assets/sounds/test-voice.mp3" />
        </div>

        <div className={styles.leftToggleContainer}>
          <div className={styles.leftToggle} />
          <span className={styles.toggleLabel}>Captions</span>
        </div>
        <div className={styles.rightToggleContainer}>
          <div className={styles.rightToggle} />
          <span className={styles.toggleLabel}>Translation</span>
        </div>
        <div className={styles.removeContainer}>
          <div className={styles.removeIcon} />
          <span className={styles.toggleLabel}>Remove</span>
        </div>
        <div className={styles.skipSection}>
          <div className={styles.skipIcon} />
          <div className={styles.skipText}>Skip</div>
        </div>

        <div className={styles.leftSideDiv}>
          <img
            src="/themes/images/v2/voice-phone/playButton-mobile.svg"
            alt="Play"
            className={styles.playButton}
          />
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.backgroundShape}>
          <div className={styles.circleContainer}>
            <img
              src="/themes/images/v2/voice-phone/purp-circleupleft-mobile.svg"
              alt="Purple Circle Up Left"
              className={styles.circleupleft}
            />
            <img
              src="/themes/images/v2/voice-phone/purple-circle-up-ri-mobile.svg"
              alt="Purple Circle Up Right"
              className={styles.circleupright}
            />
            <img
              src="/themes/images/v2/voice-phone/purp-circledownleft-mobile.svg"
              alt="Purple Circle Down Left"
              className={styles.circledownleft}
            />
            <img
              src="/themes/images/v2/voice-phone/pirp-circledownright-mobile.svg"
              alt="Purple Circle Down Right"
              className={styles.circledownright}
            />

            <img
              src="/themes/images/v2/voice/circularTextupleft.svg"
              alt="Circular Text Up Left"
              className={styles.circularText}
            />
            <img
              src="/themes/images/v2/voice/circularTextupright.svg"
              alt="Circular Text Up Right"
              className={styles.circularText}
            />
            <img
              src="/themes/images/v2/voice/circularTextdownleft.svg"
              alt="Circular Text Down Left"
              className={styles.circularText}
            />
            <img
              src="/themes/images/v2/voice/circularTextdownright.svg"
              alt="Circular Text Down Right"
              className={styles.circularText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
