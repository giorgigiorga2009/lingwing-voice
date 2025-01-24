/** @type {import('next').NextConfig} */
const previousConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'bn', 'es', 'ka', 'ru', 'tr'],
  },

  // process.env: {
  //   NEXT_PUBLIC_DEFAULT_URL ||process.env.DEFAULT_URL: process.env.NEXT_PUBLIC_DEFAULT_URL ||process.env.DEFAULT_URL,
  //   audioURL: process.env.AUDIO_URL,
  // },

  images: {
    domains: [
      'cdn-1.lingwing.com',
      'cdn-dev.lingwing.com',
      'platform-lookaside.fbsbx.com',
      'lh3.googleusercontent.com',
      'cdn.lingwing.com',
    ],
  },
};

module.exports = {
  ...previousConfig,
  env: {
    NEXT_PUBLIC_DEFAULT_URL: process.env.NEXT_PUBLIC_DEFAULT_URL,
    NEXT_PUBLIC_AUDIO_URL: process.env.NEXT_PUBLIC_AUDIO_URL,
    FACEBOOK_ID: process.env.FACEBOOK_ID,
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    NEXT_PUBLIC_SLACK_WEBHOOK_URL: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL,
    NEXT_PUBLIC_SECRET: process.env.NEXT_PUBLIC_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  output: 'standalone',
  eslint: {
    // Ignore during builds //! remove this after fixing all the eslint errors & warnings
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name][ext]',
      },
    });
    return config;
  },
};
