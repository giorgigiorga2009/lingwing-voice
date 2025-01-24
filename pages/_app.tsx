import '@styles/globals.scss';
import Script from 'next/script';
import 'regenerator-runtime/runtime';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { IntlProvider } from 'react-intl';
import { SessionProvider } from 'next-auth/react';
import { Locale, messages } from '@utils/localization';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '@components/Layout';
import { useEffect, useState } from 'react';
import { initializeLocale, initializeMobileCheck, useLocaleStore, useUserStore } from '@utils/store';
import { logHandler } from '@utils/lessons/taskUtils';
import { initViewportHandler } from '@utils/viewport';
import SessionHandler from '@components/SessionHandler';
import { GoogleTagManager } from '@next/third-parties/google';
import Maintenance from './maintenance';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient();
  const router = useRouter();
  const setLocale = useLocaleStore((state) => state.setLocale);
  const locale = useLocaleStore((state) => state.locale);
  const SetToken = useUserStore((state) => state.SetToken);
  const SetFirstName = useUserStore((state) => state.SetFirstName);
  const SetLastName = useUserStore((state) => state.SetLastName);
  const SetEmail = useUserStore((state) => state.SetEmail);
  const SetAvatar = useUserStore((state) => state.SetAvatar);
  const [isHydrated, setIsHydrated] = useState(false);
  const isLessonsPage = router.pathname.includes('lessons');
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';


  let isDesktopSize = false;

  if (typeof window !== 'undefined') {
    isDesktopSize = window.innerWidth >= 768;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
        navigator.userAgent
      );
      
      const isInAppBrowser = /FBAN|FBAV|Instagram|Line|Twitter/i.test(
        navigator.userAgent
      );

      if (isMobile || isInAppBrowser) {
        initViewportHandler();
        
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const availableLocales = ['en', 'ru', 'ka', 'tr', 'bn', 'es'];
      const currentLocale = router.locale || '';
      if (availableLocales.includes(currentLocale)) {
        setLocale(currentLocale);
      } else {
        const defaultLocale = await initializeLocale();
        setLocale(defaultLocale);

        if (defaultLocale && availableLocales.includes(defaultLocale.trim())) {
          router.replace(`/${defaultLocale}${router.asPath}`, undefined, {
            locale: defaultLocale,
          });
        } else {
          // logHandler(`here will go default lang `);
        }
      }
      setIsHydrated(true);
    };

    initialize();
  }, [router.locale, setLocale, router.asPath]);

  useEffect(() => {
    if (locale) {
      localStorage.setItem('locale', locale);
    }
  }, [locale]);

  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === 'logout') {
        SetToken('');
        SetFirstName('');
        SetLastName('');
        SetEmail('');
        SetAvatar('');
        sessionStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('progressType');
        router.push('/logout');
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, [router]);


  useEffect(() => {
    const cleanup = initializeMobileCheck();
    return cleanup;
  }, []);
  
  useEffect(() => {
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'PageView');
    }

    const handleRouteChange = () => {
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'PageView');
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  useEffect(() => {
    if (isMaintenanceMode && router.pathname !== '/maintenance') {
      router.replace('/maintenance');
    }
  }, [isMaintenanceMode, router]);
  if (isMaintenanceMode && router.pathname !== '/maintenance') {
    return <Maintenance />;
  }

  if (!isHydrated) {
    return null;
  }

  return (
    <IntlProvider locale={locale} messages={messages[locale as Locale]}>
      <GoogleTagManager gtmId="GTM-M7PZCDQ8" />
      {/* facebook pixel */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1120676731379361');
            window.fbq('track', 'PageView');
          `,
        }}
      />
      {/* Google Analytics */}
      <>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-B5ZQX8GJLD"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B5ZQX8GJLD');
        `}
        </Script>
      </>
      {/* Hotjar */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:5153756,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}
      </Script>

      {isLessonsPage && isDesktopSize && (
        <>
          <Script
            src={'https://www.smartsuppchat.com/loader.js?'}
            strategy="lazyOnload"
          />
          <Script id="" strategy="lazyOnload">
            {`var _smartsupp = _smartsupp || {};
            _smartsupp.key = '0696a3568cc098f5267b4220491bdae0748c6d75';
            window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);`}
          </Script>
        </>
      )}
      <SessionProvider session={session}>
        <SessionHandler />
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </SessionProvider>
    </IntlProvider>
  );
}

export default MyApp;