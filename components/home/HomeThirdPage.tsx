import { useTranslation } from '@utils/useTranslation';
import { FC } from 'react';
import style from './HomeThirdPage.module.scss';
import { HomeFooter } from '@components/reusables/footer/HomeFooter';
import QrCode from '@components/reusables/qrCode/QrCode';
import { ReviewsCarousel } from '@components/reusables/reviews/ReviewsCarousel';
import DownloadAppBox from '@components/shared/DownloadAppBox';
import DownloadApp from '@components/reusables/downloadApp/DownloadApp';
import VideoComponent from './VideoComponent';
import { useRouter } from 'next/router';
import { Locale } from '@utils/localization';

export const HomeThirdPage: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale as Locale || 'en';
  
  const localeToLanguageCode: { [key in Locale]: string } = {
    en: 'en',
    bn: 'bn',
    es: 'es',
    ka: 'ka',
    ru: 'ru',
    tr: 'tr',
  };

  const languageCode = localeToLanguageCode[locale] || 'en';

  const url = `/assets/video/${languageCode}.mp4`;
  const poster = `/assets/images/landing_posters/${languageCode}.jpg`;
  
  
  return (
    <div className={style.thirdPageContainer}>
      {/* <div className={style.homeIcon1}/> */}
      {/* <div className={style.homeIcon2}/> */}
      {/* <div className={style.palm} /> */}

      <div className={style.rightBg}> </div>
      <div className={style.leftBg}> </div>
      <div className={style.thirdPageContent}>
        <div className={style.videoSection}>
          <VideoComponent src={url} poster={poster} />
        </div>
        <ReviewsCarousel />

        <QrCode isCustomPage={true} />
      </div>
      <DownloadApp />
      <HomeFooter />
    </div>
  );
};
