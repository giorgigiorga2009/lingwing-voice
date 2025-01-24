import type { NextPage } from 'next'
import ErrorPage from '@components/error-pages/ErrorPage'


const Custom500: NextPage = () => {
    return (
        <ErrorPage errorCode={500} />
    )
}

export default Custom500