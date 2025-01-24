import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Header } from '../components/header/Header';
import Waveform from '../components/Waveform';
import VoiceUrl from '../public/assets/sounds/testVoice.mp3';
import CaptionsIcon from '../public/themes/images/v2/voice/captions.svg';
import LeftPart from '../public/themes/images/v2/voice/leftpart.svg';
import LeftPartText from '../public/themes/images/v2/voice/leftPartText.svg';
import PlayButton from '../public/themes/images/v2/voice/playButton.svg';
import ProgressBar from '../public/themes/images/v2/voice/progressBar.svg';
import RightPart from '../public/themes/images/v2/voice/rightpart.svg';
import RightPartText from '../public/themes/images/v2/voice/rightPartText.svg';
import SkipIcon from '../public/themes/images/v2/voice/skipIcon.svg';
import TextMenuPlayButton from '../public/themes/images/v2/voice/textMenuPlayButton.svg';
import TextMenuPlayButtonGray from '../public/themes/images/v2/voice/textMenuPlayButtonGray.svg';
import TranslateIcon from '../public/themes/images/v2/voice/translate.svg';
import VoiceIcon from '../public/themes/images/v2/voice/voice.svg';
import VoiceCircle from '../public/themes/images/v2/voice/voiceCircle.svg';
import style from './exercise.module.scss';
const Exercise: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [displayContent, setDisplayContent] = useState<string>('');
  const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);
  const [syllableData, setSyllableData] = useState<any[]>([]);
  const isMobile = window.innerWidth < 768;

  const widthBox = '45rem';

  // Syllable regex from the article
  const syllableRegex =
    /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

  const syllabify = (word: string): string[] => {
    const syllables = word.toLowerCase().match(syllableRegex);
    console.log(word, 'word');
    return syllables || [word];
  };
  // Replace the syllableMapping with dynamic syllable function
  const generateTableRows = (word: string) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase(); // Remove non-alphabetic characters
    const syllables = syllabify(cleanWord);

    return syllables.map((syllable) => ({
      syllable,
      letters: syllable.split(''),
      scores: syllable
        .split('')
        .map(() => (Math.random() > 0.5 ? 'good' : 'sounds like i')),
    }));
  };

  const handleWordClick = (
    word: string,
    index: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setClickedWordIndex((prevIndex) => (prevIndex === index ? null : index));
    setSyllableData(generateTableRows(word));
  };

  const handlePopupClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const text =
      "I always make sure to wear sunscreen every day, even when it's cloudy. It's important for skin protection.";

    setDisplayContent(text);
  }, []);

  return (
    <div className={style.exerciseContainer}>
      <Header
        size="s"
        setShowTopScores={() => {}}
        showTopScores={false}
        showDashboard={false}
        showProfile={false}
        showLanguageDropdown={false}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        isExercise={true}
        showLogo={false}
        hideAuthBox={true}
      />
      <div className={style.exerciseBox}>
        <div className={style.topBox}>
          <div className={style.voiceBox}>
            <div className={style.VoiceText}>Voice: Mariam (US) </div>
            <Image
              src={VoiceIcon}
              alt="Down Menu"
              width={25}
              height={25}
              className={style.voiceDown}
            />
          </div>
          <div className={style.captionBox}>
            <Image
              src={CaptionsIcon}
              alt="Caption"
              width={42}
              height={42}
              className={style.caption}
            />
          </div>
          <div className={style.translateBox}>
            <Image
              src={TranslateIcon}
              alt="Translate"
              className={style.translate}
              width={42}
              height={42}
            />
          </div>
          <div className={style.textBox}>
            <div className={style.displayBox}>
              {displayContent.split(' ').map((word, index) => (
                <span
                  key={index}
                  onClick={(e) => handleWordClick(word, index, e)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  {word}{' '}
                  {clickedWordIndex === index && (
                    <div
                      onClick={handlePopupClick}
                      className={style.textMenu}
                      style={{}}
                    >
                      <div className={style.textMenuBackground}>
                        <div className={style.textMenuBox}>
                          <div className={style.TextMenuPlayButtonBox}>
                            <Image
                              src={TextMenuPlayButton}
                              alt="Play Button"
                              className={style.textMenuPlayButton}
                              width={25}
                              height={25}
                            />
                            <Image
                              src={TextMenuPlayButtonGray}
                              alt="Play Button"
                              className={style.textMenuPlayButton}
                            />
                          </div>
                          <div className={style.text33}>33%</div>
                        </div>
                        <table className={style.syllableTable}>
                          <thead>
                            <tr>
                              <th>Syllable</th>
                              <th>Phone</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {syllableData.map((item, syllableIndex) => (
                              <React.Fragment key={syllableIndex}>
                                {item.letters.map(
                                  (phoneme: string, phoneIndex: number) => (
                                    <tr key={`${syllableIndex}-${phoneIndex}`}>
                                      {phoneIndex === 0 && (
                                        <td
                                          rowSpan={item.letters.length}
                                          style={{
                                            width: '5.625rem',
                                            textAlign: 'center',
                                            borderBottom: '1px solid #E0E0E0',
                                            color: '#3B3B3B',
                                            fontFamily: 'Noto Sans Georgian',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            lineHeight: '1.25rem',
                                            letterSpacing: '0.01em',
                                            textUnderlinePosition: 'from-font',
                                            textDecorationSkipInk: 'none',
                                          }}
                                        >
                                          {item.syllable}
                                        </td>
                                      )}
                                      <td
                                        style={{
                                          width: '1.875rem',
                                          textAlign: 'center',
                                          borderBottom: '1px solid #E0E0E0',
                                          borderLeft: '1px solid #E0E0E0',
                                          ...(item.scores[phoneIndex] === 'good'
                                            ? {
                                                color: '#005B50',
                                                fontFamily:
                                                  'Noto Sans Georgian',
                                                fontSize: '0.875rem',
                                                fontWeight: 400,
                                                lineHeight: '1.25rem',
                                                letterSpacing: '0.00875rem',
                                                fontVariantNumeric:
                                                  'lining-nums proportional-nums',
                                                fontFeatureSettings:
                                                  '"dlig" on',
                                                fontStyle: 'normal',
                                              }
                                            : item.scores[phoneIndex] ===
                                              'sounds like i'
                                            ? {
                                                color:
                                                  'var(--Schemes-Error, #B3261E)',
                                                fontFamily:
                                                  'Noto Sans Georgian',
                                                fontSize: '0.875rem',
                                                fontWeight: 400,
                                                lineHeight: '1.25rem',
                                                letterSpacing: '0.00875rem',
                                                fontVariantNumeric:
                                                  'lining-nums proportional-nums',
                                                fontFeatureSettings:
                                                  '"dlig" on',
                                                fontStyle: 'normal',
                                                textUnderlinePosition:
                                                  'from-font',
                                                textDecorationSkipInk: 'none',
                                              }
                                            : {}),
                                        }}
                                      >
                                        {phoneme}
                                      </td>
                                      <td
                                        style={{
                                          width: '100px',
                                          textAlign: 'center',
                                          borderBottom: '1px solid #E0E0E0',
                                          borderLeft: '1px solid #E0E0E0',
                                          ...(item.scores[phoneIndex] === 'good'
                                            ? {
                                                color: '#005B50',
                                                fontFamily:
                                                  'Noto Sans Georgian',
                                                fontSize: '14px',
                                                fontWeight: 400,
                                                lineHeight: '20px',
                                                letterSpacing: '0.14px',
                                                fontVariantNumeric:
                                                  'lining-nums proportional-nums',
                                                fontFeatureSettings:
                                                  '"dlig" on',
                                                fontStyle: 'normal',
                                              }
                                            : item.scores[phoneIndex] ===
                                              'sounds like i'
                                            ? {
                                                color:
                                                  'var(--Schemes-Error, #B3261E)',
                                                fontFamily:
                                                  'Noto Sans Georgian',
                                                fontSize: '14px',
                                                fontWeight: 400,
                                                lineHeight: '20px',
                                                letterSpacing: '0.14px',
                                                fontVariantNumeric:
                                                  'lining-nums proportional-nums',
                                                fontFeatureSettings:
                                                  '"dlig" on',
                                                fontStyle: 'normal',
                                                textUnderlinePosition:
                                                  'from-font',
                                                textDecorationSkipInk: 'none',
                                              }
                                            : {}),
                                        }}
                                      >
                                        {item.scores[phoneIndex]}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className={style.georgianTextBox}>
            <div className={style.georgianText}>
              ყოველთვის ვისვამ მზისგან დამცავს, მაშინაც კი, როცა მოღრუბლულია. ეს
              მნიშვნელოვანია კანის დაცვისთვის.
            </div>
          </div>
          <div className={style.soundWaveBox}>
            <div className={style.playButtonBox}>
              <Image
                src={PlayButton}
                alt="Sound Wave"
                className={style.playButton}
              />
            </div>
            <div className={style.soundWave}>
              <Waveform audioUrl={VoiceUrl} />
            </div>
          </div>
        </div>
        <div className={style.bottomBox}>
          <Image
            src={LeftPart}
            alt="Left Part"
            width={356}
            height={456}
            className={style.leftPart}
          />
          <Image
            src={RightPart}
            alt="Right Part"
            width={356}
            height={456}
            className={style.rightPart}
          />
          <Image
            src={ProgressBar}
            alt="Progress Bar"
            className={style.progressBar}
          />
          <div className={style.scoreBox}>
            <div className={style.scoreText}>50/</div>
            <div className={style.finalScoreText}>120</div>
          </div>
          <div className={style.voiceCircleBox}>
            <Image
              src={VoiceCircle}
              alt="Voice Circle"
              className={style.voiceCircle}
            />
          </div>
          <div className={style.skipBox}>
            <div className={style.skipText}>Skip</div>
            <Image src={SkipIcon} alt="Skip Icon" className={style.skipIcon} />
          </div>
          <Image
            src={LeftPartText}
            alt="Left Part Text"
            className={style.leftPartText}
          />
          <Image
            src={RightPartText}
            alt="Right Part Text"
            className={style.rightPartText}
          />
        </div>
      </div>
    </div>
  );
};

export default Exercise;
