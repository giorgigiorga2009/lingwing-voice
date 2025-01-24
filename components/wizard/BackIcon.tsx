import { useTranslation } from '@utils/useTranslation'
import style from './BackIcon.module.scss'
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Back = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const query = router.query;
    let route = '/' 


    console.log('Go Back query', query)

    if (query.languageFrom && query.languageTo) {
            route = `/wizard?languageTo=${query.languageTo}`;
    } else if (query.languageTo && !query.languageFrom) {
        route = `/wizard`;
    }

    return (
        <Link href={route}>
            <div className={`${style.backContainer} ${ route === '/' ? style.hideBack : '' }`}>
                <button
                    className={style.backArrow}
                />
                <h1 className={style.backText}>{t('BACK')}</h1>
            </div>
        </Link>
    )
}