import { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import style from './HomeFooter.module.scss'
import { useTranslation } from '@utils/useTranslation'
import { FOOTER_LINKS, FOOTER_LINKS_MOBILE } from '@utils/const'
import classNames from 'classnames'

interface HomeFooterProps {
    isCustomPage?: boolean;
}

export const HomeFooter: FC<HomeFooterProps> = ({ isCustomPage = false }) => {
    const { t } = useTranslation()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const currentLinks = isMobile ? FOOTER_LINKS_MOBILE : FOOTER_LINKS
    type Links = keyof typeof currentLinks
    const LINKS = Object.keys(currentLinks) as Links[]

    return (
        <div className={classNames(style.footer, {[style.customFooter]: isCustomPage})}>
            <div className={style.footerContent}>
                {LINKS.map(link => (
                    <div key={link} className={style.link}>
                        <div className={ style.inner_link }>
                            <Link href={currentLinks[link]}
                            target={link === 'footerBlog' ? '_blank' : '_self'}>
                                {t(link)}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}