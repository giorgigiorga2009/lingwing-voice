import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Jobs from '@components/about-page/Jobs'
import { PageHead } from '@components/PageHead'
import style from './about-company.module.scss'
import { Footer } from '@components/wizard/Footer'
import { ABOUT_COMPANY_LINKS } from '@utils/const'
import { Header } from '@components/header/Header'
import AboutUs from '@components/about-page/AboutUs'
import Partners from '@components/about-page/Partners'
import { useTranslation } from '@utils/useTranslation'
import AboutTabs from '@components/about-page/AboutTabs'
import Certificate from '@components/about-page/Certificate'
import { FollowButtons } from '@components/home/FollowButtons'
import { HomeFooter } from '@components/reusables/footer/HomeFooter'

const AboutCompany: NextPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const activeTab = router.query.page as string

  return (
    <div className={style.container}>
      <PageHead
        title="META_TAG_ABOUT_COMPANY_TITLE"
        description="META_TAG_ABOUT_COMPANY_DESCRIPTION"
        keywords="META_TAG_ABOUT_COMPANY_KEYWORDS"
      />
      <Header
        size="s"
        loginClassName={style.loginModal}
        setShowTopScores={() => false}
        showTopScores={false}
      />
      <div className={style.content}>
        <h1 className={style.title}>{t('APP_ABOUT_US_COMPANY')}</h1>
        <div className={style.tabsWrapper}>
        <AboutTabs activeTab={activeTab} />
        </div>
        <div className={style.wrapper}>
          <div className={style.mainBlock}>
            {activeTab === ABOUT_COMPANY_LINKS.About && <AboutUs />}
            {activeTab === ABOUT_COMPANY_LINKS.Certificate && <Certificate />}
            {activeTab === ABOUT_COMPANY_LINKS.Partners && <Partners />}
            {activeTab === ABOUT_COMPANY_LINKS.Jobs && <Jobs />}
          </div>
        </div>
        
        <HomeFooter />
      </div>
      
      <FollowButtons color="grey" isContactUs />
        {/* <HomeFooter /> */}
    </div>
  )
}

export default AboutCompany
