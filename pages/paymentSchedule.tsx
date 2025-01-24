import React from 'react'
import Image from 'next/image'
import { NextPage } from 'next'
import { Reviews } from '@components/Reviews'
import style from './paymentSchedule.module.scss'
import { Header } from '@components/header/Header'
import { Footer } from '@components/wizard/Footer'
import Schedule from '@components/paymentSchedule/schedule'
import { FollowButtons } from '@components/home/FollowButtons'
import rocketParrot from '@public/assets/images/rocketParrot.png'
import { HomeFooter } from '@components/reusables/footer/HomeFooter'

const PaymentSchedule: NextPage = () => {
  return (
    <div className={style.container}>
      <Header setShowTopScores={() => false} showTopScores={false}/>
      <Image
        src={rocketParrot}
        className={style.rocketParrot}
        alt=""
        width={500}
        height={500}
        priority={true}
      />
      <Schedule />
      <Reviews />
      <FollowButtons color="grey" />
      {/* <Footer /> */}
      <HomeFooter />
    </div>
  )
}

export default PaymentSchedule
