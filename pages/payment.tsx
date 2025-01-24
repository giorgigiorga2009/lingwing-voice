import {
  PaymentProps,
  getPayWithList,
  PaymentMethod,
  getPackageDataById,
  PackageResponse,
  getCheckedPackageId,
} from '@utils/getPayments'
import Image from 'next/image'
import { NextPage } from 'next'
import { useStore } from '@utils/store'
import { useRouter } from 'next/router'
import styles from './payment.module.scss'
import { useSession } from 'next-auth/react'
import { Reviews } from '@components/Reviews'
import Loader from '@components/loaders/loader'
import { Header } from '@components/header/Header'
import { Footer } from '@components/wizard/Footer'
import { useTranslation } from '@utils/useTranslation'
import CountdownTimer from '@components/payment/CountDown'
import PaymentOption from '@components/payment/PaymentOption'
import { Currency } from '@components/packages/CurrencyPicker'
import { FollowButtons } from '@components/home/FollowButtons'
import { PaymentFeatures } from '@components/payment/benefits'
import { LoginModal } from '@components/loginWindow/LoginModal'
import React, { useCallback, useEffect, useState } from 'react'
import rocketParrot from '@public/assets/images/rocketParrot.png'
import BackgroundParrot from '@components/shared/BackgroundParrot'
import PaymentInfo from '@components/payment/paymentInfo'
import PaymentAdditonalInfo from '@components/payment/paymentAdditionalInfo'


const Payment: NextPage<PaymentProps> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const selectedCurrency = useStore(state => state.selectedCurrency)
  const [payWithListData, setPayWithListData] = useState<PaymentMethod[]>([])
  const [data, setData] = useState<PackageResponse>()
  const [checkedPackageOrderId, setCheckedPackageOrderId] = useState<string>('');
  
  const { id, coupon } = router.query
  const { data: session } = useSession()
  const [openLogin, setOpenLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const title = data?.packages[0].title.toString();  
  
  const handleCloseLogin = useCallback(() => {
    setOpenLogin(false)
    router.push('/')
  }, [router])

  useEffect(() => {
    if (session?.user.accessToken) {
      setIsLoading(false)
    } else {
      const timeout = setTimeout(() => setIsLoading(false), 1000)
      return () => clearTimeout(timeout)
    }

    !session?.user.accessToken && setOpenLogin(true)
  }, [session, id])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payWithList = await getPayWithList()
        setPayWithListData(payWithList)

        if (id && session) {
          const checkedPackage = await getCheckedPackageId(
            id as string,
            session?.user.accessToken,
            coupon as string,
          )
          if (checkedPackage) {
            const packageData = await getPackageDataById(
              checkedPackage.orderId,
              session?.user.accessToken,
            )
            setData(packageData)
            setCheckedPackageOrderId(checkedPackage.orderId)
          }
        }
      } catch (err) {
        console.error('An error occurred:', err)
      }
    }

    fetchData()
  }, [id, coupon, session])

  useEffect(() => {
    if (data && selectedCurrency !== undefined) {
      localStorage.setItem(
        'duration',
        JSON.stringify(data.packages[0].duration),
      )
      localStorage.setItem(
        'recurringPrice',
        JSON.stringify(
          data.packages[0].currency[selectedCurrency].recurringPrice,
        ),
      )
      localStorage.setItem(
        'symbol',
        JSON.stringify(data.packages[0].currency[selectedCurrency]._id.symbol),
      )
    }
  }, [data, selectedCurrency])

  const monthlyPayment =
    data?.packages[0].currency[selectedCurrency].recurringPrice !== undefined
      ? data?.packages[0].currency[selectedCurrency].recurringPrice /
        data?.packages[0].duration
      : undefined
  

  if (isLoading) {
    return <Loader />
  }

  
  if (!session?.user.accessToken) {
    return (
      <>
        <BackgroundParrot />
        <LoginModal
          lighterBG={true}
          openLogin={openLogin}
          setOpenLogin={setOpenLogin}
          onClick={handleCloseLogin}
        />
      </>
    )
  }

  return (
    <div className={styles.container}>
      <Header size="s" loginClassName={styles.loginModal} setShowTopScores={() => false} showTopScores={false}/>
      <Image
        src={rocketParrot}
        className={styles.rocketParrot}
        alt=""
        width={500}
        height={500}
        priority={true}
      />
      <div className={styles.paymentInfoCard}>
        <div className={styles.currency}>
          {data?.currencies.map((currency, index) => (
            <Currency
              identifier={currency.identifier}
              symbol={currency.symbol}
              index={index}
              key={currency.identifier}
              //onClick={() => setSelectedCurrency(index)}
              // selectedCurrency={selectedCurrency}
            />
          ))}
        </div>
        <h2 className={styles.infoCardHeader}>
          <span>
            {t(`${""}${title}${""}`)}
          </span>
        </h2>
        <CountdownTimer token={session?.user.accessToken as string | null} />
        <div className={styles.pHeader}>
          {/* <p>{t('PAYMENT_CHOOSE_PAYMENT_TYPE')}</p> */}
        </div>
        <div>
          <PaymentOption
            currentPackage={data?.packages[0]}
            monthlyPayment={monthlyPayment}
            selectedCurrency={selectedCurrency}
            payWithOptions={payWithListData}
            accessToken={session?.user.accessToken}
            checkedPackageOrderId={checkedPackageOrderId}
          />
        </div>
        {/* {data?.packages[0].feature && (
          <PaymentFeatures feature={data?.packages[0].feature} />
        )} */}
      </div>
      {/* <PayPalButton/> */}
      {/* <Reviews /> */}
      {/* <FollowButtons color="grey" /> */}
      {/* <Footer /> */}
      
      {/* <div className={styles.regReminder}>
          <LessonsFlowPopUps
            token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsaW5nd2luZy1hcGkiLCJpYXQiOjE3MjE3NDcyMDYyNjIsImV4cCI6MTkyMTA3MjAwNjI2MiwidXNlcl9pZCI6IjY2OTY0MmVhYzkyMTRmNzdmZGQ5NTllMyJ9.vNqPH37Hw5yq-AGFSIcl02PHzSY6kVhT8pcTXOGrU6Y'
            popUpNumber={3}
            packetTitle={data?.packages[0].title}
          />
        </div>  */}
      {/* <div className={styles.regReminder}>
        <RateLingwing/>
        </div> */}
    </div>
  )
}

export default Payment
