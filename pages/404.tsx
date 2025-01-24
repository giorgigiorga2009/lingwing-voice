import type { NextPage } from 'next'
import ErrorPage from '@components/error-pages/ErrorPage'

const Custom404: NextPage = () => {
    return (
        <ErrorPage errorCode={404} />
    )
}

export default Custom404