import { FC, useEffect, useState } from 'react';
import style from './Footer.module.scss';
import { FOOTER_LINKS, FOOTER_LINKS_MOBILE } from '@utils/const';
import { useTranslation } from '@utils/useTranslation';
import Link from 'next/link';

export const Footer: FC = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentLinks = isMobile ? FOOTER_LINKS_MOBILE : FOOTER_LINKS;
  type Links = keyof typeof currentLinks;
  const LINKS = Object.keys(currentLinks) as Links[];

  return (
    <div className={style.footer}>
      {LINKS.map((link) => (
        <div key={link} className={style.link}>
          <Link href={currentLinks[link]}
          target={link === 'footerBlog' ? '_blank' : '_self'}
          >{t(link)}</Link>
        </div>
      ))}
    </div>
  );
};
