import {
  ABOUT_COMPANY_KEYS,
  COURSES_KEYS,
  HELP_KEYS,
  PREMIUM_KEYS,
  SIDE_MENU_LINKS,
} from '@utils/const'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Foco from 'react-foco'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import styles from './SideMenu.module.scss'
import { LessonsSideMenu } from './LessonsSideMenu'
import { useTranslation } from '@utils/useTranslation'
import { CourseObject } from '@utils/lessons/getTask'

export type SideMenuKeys = keyof typeof SIDE_MENU_LINKS

interface SectionProps {
  options: SideMenuKeys[]
  title: string
  onClose: () => void
}

const Section: FC<SectionProps> = ({ options, title, onClose }) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <section>
      <h3>{title}</h3>
      <nav className={styles.list}>
        {options.map(element => {
          const [pathname, queryKey, queryValue] = SIDE_MENU_LINKS[element]
          const query = queryKey && queryValue ? { [queryKey]: queryValue } : {}

          return (
            <Link
              href={{ pathname, query }}
              locale={router.locale}
              key={element}
              onClick={onClose}
              target={element === 'menuBlog' ? '_blank' : '_self'}
            >
              {t(element)}
            </Link>
          )
        })}
      </nav>
    </section>
  )
}

interface SideMenuProps {
  onClose: () => void
  lessonsPage?: boolean
  currentCourseObject?: CourseObject
  token?: string | null
  openSideMenu: boolean
}

export const SideMenu: FC<SideMenuProps> = ({
  onClose,
  lessonsPage,
  currentCourseObject,
  token,
  openSideMenu,
}) => {
  const { t } = useTranslation()
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div className={`${styles.wrapper} ${openSideMenu ? styles.visible : ''}`}>
      <Foco
        component="div"
        className={`${styles.container} ${openSideMenu ? styles.visible : ''}`}
        onClickOutside={onClose}
      >
        <button className={styles.button} onClick={onClose} title='close'/>
        {!(lessonsPage &&  screenWidth < 1024) ? (
          <div className={styles.content}>
            <div className={styles.ball} />
            <div className={styles.menu}>
              <Section
                title={t('footerCourses')}
                options={COURSES_KEYS}
                onClose={onClose}
              />
              <Section
                title={t('menuPremium')}
                options={PREMIUM_KEYS}
                onClose={onClose}
              />
              <Section
                title={t('menuCompany')}
                options={ABOUT_COMPANY_KEYS}
                onClose={onClose}
              />
              <Section
                title={t('menuHelp')}
                options={HELP_KEYS}
                onClose={onClose}
              />
            </div>

            <div className={styles.footer}>
              <h3 className={styles.title}>{t('menuDownloadApp')}</h3>
              <div className={styles.mobileMarkets}>
                <a
                  className={classNames(styles.market, styles.apple)}
                  href="https://play.google.com/store/apps/details?id=org.android.lingwing.app"
                >
                  {' '}
                </a>
                <a
                  className={classNames(styles.market, styles.google)}
                  href="https://apps.apple.com/us/app/lingwing-language-learning/id1217989755"
                >
                  {' '}
                </a>
              </div>
            </div>
          </div>
        ) : (
          currentCourseObject &&
          token ? (
            <LessonsSideMenu
              currentCourseObject={currentCourseObject}
              token={token}
            />
          ) : null
        )}
      </Foco>
    </div>
  )
}
