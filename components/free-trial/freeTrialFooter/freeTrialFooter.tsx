import { FREETRIALFOOTER_LINKS } from "@utils/const";
import { useTranslation } from "@utils/useTranslation";
import Link from "next/link";
import { FC } from "react";
import style from './freeTrialFooter.module.scss'

export const FreeTrialFooter: FC = () => {
    const { t } = useTranslation()
    type Links = keyof typeof FREETRIALFOOTER_LINKS
    const LINKS = Object.keys(FREETRIALFOOTER_LINKS) as Links[]
  
    return (
      <div className={style.footer}>
        {LINKS.map(link => (
          <div key={link} className={style.link}>
            <Link href={FREETRIALFOOTER_LINKS[link]}>
                {t(link)}
            </Link>
          </div>
        ))}
      </div>
    );
  };