import { FC } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import style from './AboutTabs.module.scss'
import { ABOUT_COMPANY_LINKS } from '@utils/const'
import { useTranslation } from '@utils/useTranslation'
interface Props {
  activeTab: string
}

const AboutTabs: FC<Props> = ({ activeTab }) => {
  const { t } = useTranslation()
  const router = useRouter()

  type Tabs = keyof typeof ABOUT_COMPANY_LINKS
  // const TABS = Object.keys(ABOUT_COMPANY_LINKS) as Tabs[]

  return (
    <nav className={style.nav}>
      <ul className={style.ulNav}>
        {Object.entries(ABOUT_COMPANY_LINKS).map(([key, value]) => (
          <Link
            key={value}
            className={style.link}
            locale={router.locale}
            href={{
              pathname: '/about-company',
              query: { page: value },
            }}
          >
            <li
              className={classNames(
                style.liNav,
                activeTab === value && style.activeMenu,
              )}
            >
              {t(key)}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  )
}

export default AboutTabs
