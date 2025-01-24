import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import style from './packages.module.scss';
import FAQ from '@components/packages/Faq';
import { Locale } from '@utils/localization';
import { Reviews } from '@components/Reviews';
import { FormattedMessage } from 'react-intl';
import { PageHead } from '@components/PageHead';
import Coupon from '@components/packages/Coupon';
import { Header } from '@components/header/Header';
import { Footer } from '@components/wizard/Footer';
import ContactUs from '@components/packages/ContactUs';
import { useTranslation } from '@utils/useTranslation';
import { LOCALES_TO_LANGUAGES } from '@utils/languages';
import PricingCards from '@components/packages/PricingCards';
import { FollowButtons } from '@components/home/FollowButtons';
import { scrollToElement } from '@components/packages/ScrollToElement';
import { HomeFooter } from '@components/reusables/footer/HomeFooter';
import { ReviewsCarousel } from '@components/reusables/reviews/ReviewsCarousel';

const Package: NextPage = () => {
  const { t } = useTranslation();
  const [coupon, setCoupon] = useState('');
  const router = useRouter();
  const locale = router.locale ?? 'en';
  const couponRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const { scrollTo } = router.query;
    
    if (scrollTo) {
      timeoutId = setTimeout(() => {
        scrollToElement(scrollTo as string);
      }, 1000);
    }

    // Clean up timeout if component unmounts or query changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [router.query]);

  return (
    <div className={style.container}>
      <PageHead
        title="META_TAG_PACKAGES_TITLE"
        description="META_TAG_PACKAGES_DESCRIPTION"
        keywords="META_TAG_PACKAGES_KEYWORDS"
      />
      <Header
        size="s"
        loginClassName={style.loginModal}
        setShowTopScores={() => false}
        showTopScores={false}
      />
      <main>
        <p className={style.desc}>
          <FormattedMessage
            id="APP_PACKAGE_DESC"
            values={{
              k: (chunks: React.ReactNode) => (
                <span className={style.fiveTimesFaster}>{chunks}</span>
              ),
            }}
          />
        </p>
        <p className={style.smallDesc}>
          <FormattedMessage
            id="APP_PACKAGE_SMALL_DESC"
            values={{
              k: (chunks: React.ReactNode) => (
                <span className={style.fiveTimesFaster}>{chunks}</span>
              ),
            }}
          />
        </p>


        <PricingCards showPackages={[0, 1, 2, 3]} coupon={coupon} />
        <div className={style.bottomText}>
          <div className={style.bottomText_inner}>
            <FormattedMessage
              id="APP_PACKAGE_PAGE_BOTTOM_TEXT"
              values={{
                k: (chunks: React.ReactNode) => (
                  <span style={{color: '#F42BD9'}}>{chunks}</span>
                ),
              }}
            />
          </div>
        </div>

        <section id="coupon" ref={couponRef}>
          <Coupon onClick={(couponText) => setCoupon(couponText)} />
        </section>
        <ContactUs />
        <ReviewsCarousel />
        <FAQ locale={LOCALES_TO_LANGUAGES[locale as Locale]} />

        <FollowButtons color="grey" isProfile={true} />
        {/* <Footer /> */}

        <HomeFooter />
      </main>
    </div>
  );
};

export default Package;
