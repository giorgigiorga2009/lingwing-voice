import React from 'react'
import { NextPage } from 'next'
import style from './free-trial.module.scss'
import { Header } from '@components/header/Header'
import Container from '@components/free-trial/container/container'
import { HomeFooter } from '@components/reusables/footer/HomeFooter'

const freeTrial: NextPage = () => {
  return (
    <>
      <Header size="s" setShowTopScores={() => false} showTopScores={false}/>
      <div className={style.container}>
        <Container />
      </div>
      <div className={style.footer}>
        <HomeFooter />
      </div>
    </>
  )
}

export default freeTrial
