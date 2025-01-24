import { FC } from 'react';
import Head from 'next/head';
import { useTranslation } from '@utils/useTranslation';

interface Props {
  title: string;
  description: string;
  keywords: string;
}

export const PageHead: FC<Props> = ({ title, description, keywords }) => {
  const { t } = useTranslation();

  return (
    <Head>
      <title>{t(title)}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={t(description)} />
      <meta name="keywords" content={t(keywords)} />
      <meta property="og:description" content={t(description)}></meta>
      <meta property="og:title" content={t(title)}></meta>
      <meta
        property="og:image"
        content="https://lingwing.com/themes/images/v2/display.png"
      ></meta>
      <meta property="og:image:alt" content="Lingwing Logo" />
      <meta
        property="og:url"
        content={'https://lingwing.com/'}
      />
      <meta property="og:type" content={'website'} />
      <meta
        property="fb:app_id"
        content={'H2zVlOBKHx916NjSlvNC9RVhe8kyC9aZppkYGVZlUNg'}
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />

      <meta
        name="google-site-verification"
        content="H2zVlOBKHx916NjSlvNC9RVhe8kyC9aZppkYGVZlUNg"
      ></meta>
      <meta
        name="facebook-domain-verification"
        content="tjk8pca0ajrw8hj985o2b6fov52o7h"
      ></meta>
      <meta name="theme-color" content="#692E96"></meta>
      <meta name="author" content="Lingwing Team" />
      <meta name="robots" content="index, follow" />
      <meta name="google" content="notranslate"></meta>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge"></meta>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />

      <link rel="alternate" href="https://lingwing.com/en/" hrefLang="en-us" />
      <link rel="alternate" href="https://lingwing.com/ka/" hrefLang="ka-ge" />
      <link rel="alternate" href="https://lingwing.com/ru/" hrefLang="ru-ru" />
      <link rel="alternate" href="https://lingwing.com/es/" hrefLang="es-es" />
      <link rel="alternate" href="https://lingwing.com/tr/" hrefLang="tr-tr" />
    </Head>
  );
};
