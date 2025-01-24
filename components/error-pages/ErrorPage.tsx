import style from './ErrorPage.module.scss'
import { Header } from '@components/header/Header'
import Link from 'next/link'
import disconnectedCable from 'public/themes/images/error404/interrupted-cable-error.png'
import Image from 'next/image'
import { useTranslation } from '@utils/useTranslation'


const ErrorPage = ({errorCode}: { errorCode: number }) => {
    const { t } = useTranslation();
    return (

        <div className={style.error_container}>
            <Header size="s" setShowTopScores={() => true} showTopScores={false} />
            <div className={style.error_container_content}>

                {errorCode === 404 ? <div className={`${style.error_code}`}>
                    <div>4</div>
                    <div>0</div>
                    <div>4</div>
                </div> : <div className={`${style.error_code_500}`}>
                    <div>5</div>
                    <div>0</div>
                    <div>0</div>
                </div>}
                <Image className={style.second_image} src={disconnectedCable} alt='disconnected Cable' />
                <div className={style.error_inner_contant}>
                    <div className={style.error_text}>
                        <h3 className={style.error_text_h3} >{errorCode === 404
                            ?
                            t('ERROR_PAGE_NOT_FOUND')
                            :
                            t('ERROR_PAGE_INTERNAL_SERVER_ERROR')}</h3>
                        <p className={style.error_text_body} >{t('ERROR_PAGE_TEXT')}</p>
                    </div>
                    <div className={style.error_button}>
                        <Link href={'/'} style={{ textDecoration: 'none' }}><button className={style.button}>{t('ERROR_PAGE_GO_BACK_HOME')}</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage