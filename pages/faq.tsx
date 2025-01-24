import Head from 'next/head'
import { NextPage } from 'next'
import classNames from 'classnames'
import style from './faq.module.scss'
import { useRouter } from 'next/router'
import { Locale } from '@utils/localization'
import { PageHead } from '@components/PageHead'
import Loader from '@components/loaders/loader'
import { Header } from '@components/header/Header'
import React, { useEffect, useState } from 'react'
import { Footer } from '@components/wizard/Footer'
import { ApiResponse, getFAQs } from '@utils/getFAQ'
import { useTranslation } from '@utils/useTranslation'
import { LOCALES_TO_LANGUAGES } from '@utils/languages'
import { FollowButtons } from '@components/home/FollowButtons'
import { HomeFooter } from '@components/reusables/footer/HomeFooter'

const Faq: NextPage = () => {
  const { t } = useTranslation()
  const [faqData, setFaqData] = useState<ApiResponse>()
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null,
  )

  const router = useRouter()
  const locale = router.locale ?? 'eng'
  const locales = LOCALES_TO_LANGUAGES[locale as Locale]

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await getFAQs(locales)
        setFaqData(response)
      } catch (error) {
        console.error('Failed to fetch FAQ data:', error)
      }
    }
    fetchFaqData()
  }, [locale, locales])

  // const faqSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "FAQPage",
  //   "mainEntity": {
  //     "@type": "Question",
  //     "name": faqData?.data[0].objects[0].question[locales] || 'default question here ...',
  //     "acceptedAnswer": {
  //       "@type": "Answer",
  //       "text": "www.lingwing.com is an online language-learning platform, created with the use of the newest technologies and algorithms. It is intended for everyone who wishes to learn a new language and start speaking at once, revise previously taught language, improve his or her knowledge and prepare for exams."
  //     }
  //   }
  // }
  if (locale === 'bn') {
    return (
      <div className={style.wrapper}>
        <Header size="s" loginClassName={style.loginModal} setShowTopScores={() => false} showTopScores={false}/>
        <header>
          <h1 className={style.titleContainer}>{t('FAQ_TITLE')}</h1>
        </header>
        <div className={style.mainPart}>
          <section className={style.QAContainer}>
            <p>লোডিং হচ্ছে...</p>
          </section>
        </div>
      </div>
    )
  }
  if (!faqData) {
    return <Loader />
  }
  // const faqSchema = {
  //   '@context': 'https://schema.org',
  //   '@type': 'FAQPage',
  //   mainEntity: faqData?.data
  //     .map(category => {
  //       return category.objects.map(({ question, answer }) => ({
  //         '@type': 'Question',
  //         name: question[locales] || 'question here ...',
  //         acceptedAnswer: {
  //           '@type': 'Answer',
  //           text: answer[locales] || 'answer here ...',
  //         },
  //       }))
  //     })
  //     .flat(),
  // }

  return (
    <div className={style.wrapper}>
      <Head>
        <script
          type="application/ld+json"
          // dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
      <PageHead
        title="META_TAG_FAQ_TITLE"
        description="META_TAG_FAQ_DESCRIPTION"
        keywords="META_TAG_FAQ_KEYWORDS"
      />
      <Header size="s" loginClassName={style.loginModal} setShowTopScores={() => false} showTopScores={false} />
      <main>
        <header>
          <h1 className={style.titleContainer}>{t('FAQ_TITLE')}</h1>
        </header>
        <div className={style.mainPart}>
          <aside className={style.buttonContainer}>
            {faqData?.data.map(({ _id }, index) => (
              <button
                key={`faqData-${index}`}
                onClick={() => setActiveCategoryIndex(index)}
                className={classNames(style.buttons, {
                  [style.activeButton]: activeCategoryIndex === index,
                })}
              >
                {_id?.name}
              </button>
            ))}
          </aside>
          <section className={style.QAContainer}>
            <h2>{faqData?.data[activeCategoryIndex]?._id?.name}</h2>
            {faqData?.data[activeCategoryIndex]?.objects.map(
              ({ question, answer }, index) => (
                <article key={`category-${index}`}>
                  <button
                    className={classNames(
                      style.faq__question,
                      activeQuestionIndex === index &&
                        style.faq__question__open,
                    )}
                    onClick={() =>
                      setActiveQuestionIndex(
                        activeQuestionIndex === index ? null : index,
                      )
                    }
                  >
                    {question[locales]}
                  </button>
                  <div
                    className={classNames(
                      style.faq__answer,
                      index === activeQuestionIndex && style.faq__answer__open,
                    )}
                  >
                    {answer[locales]}
                  </div>
                </article>
              ),
            )}
          </section>
          {/* <FollowButtons color="grey" isContactUs={true} /> */}
        </div>
        
      </main>
      <FollowButtons color="grey" isContactUs={true} />
      {/* <Footer /> */}
      <HomeFooter />
    </div>
  )
}

export default Faq
