import React from 'react';
import Image from 'next/image';
import style from './CourseInfo.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { CourseInfoProps } from '@utils/getReadCourse';
import RedirectButton from '@components/reusables/RedirectButton';

function CourseInfo({
  info,
  title,
  smallDescription,
  languageTo,
  languageFrom,
  courseName,
}: CourseInfoProps) {
  const { t } = useTranslation();
  let yesBubbleText = '';
  let yesBubbleTextEsp = '';
  const parrotVar = `/themes/images/v2/${languageTo}-parrot.png`;
  const fragVar = `/assets/images/flags/circle/small-languageCode/${languageTo}-flag.png`;
  const bubbleVar = `/themes/images/v2/parrot-course-bubble.png`;

  switch (languageTo) {
    case 'eng':
      yesBubbleText = 'Yes';
      break;
    case 'esp':
      yesBubbleTextEsp = 'Sí';
      break;
    case 'ita':
      yesBubbleText = 'SÌ';
      break;
    case 'rus':
      yesBubbleText = 'Да';
      break;
  }

  return (
    <div className={style.courseInfo}>
      <Image
        src={parrotVar}
        alt={`${languageTo} parrot`}
        className={style.parrot}
        width={500}
        height={400}
      />

      <div
        className={
          languageTo !== 'esp'
            ? style.bubbleContainer
            : style.bubbleContainerEsp
        }
      >
        {(languageTo === 'eng' ||
          languageTo === 'ita' ||
          languageTo === 'rus' ||
          languageTo === 'esp') && (
          <Image
            src={bubbleVar}
            alt="speech bubble with 'yes' text"
            className={style.bubble}
            width={300}
            height={300}
          />
        )}
        <div className={style.bubbleText}>
          {languageTo !== 'esp' ? yesBubbleText : yesBubbleTextEsp}
        </div>
      </div>

      <section className={style.adSection}>
        <div className={style.title}>
          <Image
            className={style.flagstyle}
            src={fragVar}
            alt={`${languageTo} flag`}
            width={80}
            height={80}
          />
          <h2>{title}</h2>
        </div>
        <div className={style.statsContainer}>
          <p className={style.slogan}>{smallDescription}</p>
          <div className={style.speciesContainer}>
            <div className={style.numbersList}>
              <div className={style.speciesNumber}>
                <p className={style.statsNum}>{info?.tasksQuantity}</p>
                <p className={style.speciesText}>
                  {t('ABOUT_COURSE_EXCERCISES')}
                </p>
              </div>
              <div className={style.speciesNumber}>
                <p className={style.statsNum}>{info?.uniqueWordsQuantity}</p>
                <p className={style.speciesText}>{t('ABOUT_COURSE_WORDS')}</p>
              </div>
              <div className={style.speciesNumber}>
                <p className={style.statsNum}>{info?.courseFinishTime}</p>
                <p className={style.speciesText}>{t('ABOUT_COURSE_HOURS')}</p>
              </div>
            </div>
            <Image
              src={parrotVar}
              alt="Parrot"
              className={style.smallSizeParrot}
              width={300}
              height={300}
            />
          </div>
          <div className={style.btn}>
            <RedirectButton
              href={`lessons/course?languageTo=${languageTo}&languageFrom=${languageFrom}&courseName=${courseName}`}
            >
              {t('ABOUT_COURSE_START_LEARNING')}
            </RedirectButton>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CourseInfo;
