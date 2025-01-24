import { PageHead } from '@components/PageHead'
import style from './wrapper.module.scss'
import { Header } from '@components/header/Header'
import { Footer } from '@components/wizard/Footer'
import { FollowButtons } from '@components/home/FollowButtons'

const ContainerWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={style.container}>
      <PageHead
        title="META_TAG_RESET_PASSWORD_TITLE"
        description="META_TAG_RESET_PASSWORD_DESCRIPTION"
        keywords="META_TAG_RESET_PASSWORD_KEYWORDS"
      />
      <Header size="s" setShowTopScores={() => false} showTopScores={false} />
      <div className={style.window}>{children}</div>
      <Footer />
      <FollowButtons dashboard={true} />
    </div>
  )
}

export default ContainerWrapper
