import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './planSelection.module.scss'
import classNames from 'classnames'
import rocketParrot from '@public/assets/images/rocketParrot.png'
import starIcon from '@public/assets/images/pr-star-icon.png'
import { PackageData, PackagesInfoProps, getPackages } from '@utils/getPackages'

const PlanSelection: React.FC<PackagesInfoProps> = ({
  token,
  header,
  paragraph,
  buttonText,
  index,
  fromGelText,
}) => {
  const [data, setData] = useState<PackageData>()

  const [redirectTo, setRedirectTo] = useState('/');

  
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await getPackages('')
        setData(response)
      } catch (error) {}
    }
    loadPackages()
  }, [])

  const isAuthorised = token && token.length > 10;
  const isPremium = index === 2

  useEffect(() => {
    if (isPremium) {
      setRedirectTo('/packages');
    } else if (index === 0) {
      setRedirectTo('/free-trial');
    } else if (index === 1 && isAuthorised) {
      setRedirectTo('/dashboard');
    } else {
      setRedirectTo('/');
    }
  }, [isPremium, isAuthorised, index]);

  const monthlyPayment = data?.packages[1]?.currency[0]?.recurringPrice
    ? data.packages[1].currency[0].recurringPrice / data.packages[1].duration
    : undefined

  return (
    <div
      className={classNames(style.container, {
        [style.differentBG]: index === 1,
      })}
    >
      <div className={style.buble} />
      <div
        className={classNames(style.header, {
          [style.premiumHeader]: isPremium,
        })}
      >
        <h3>{header}</h3>
        <p>{paragraph}</p>
      </div>
      {isPremium && (
        <Image
          src={rocketParrot}
          className={style.rocketParrot}
          alt=""
          width={500}
          height={500}
          priority
        />
      )}
      <div className={isPremium ? style.premiumButtonDiv : style.buttonDiv}>
        <Link href={redirectTo}>
          <button
            className={classNames(style.button, {
              [style.premiumButton]: isPremium,
            })}
          >
            <div className={style.buttonWrapper}>
              {isPremium && (
                <Image src={starIcon} alt="" width={30} height={30} priority />
              )}
              {buttonText}
            </div>
          </button>
        </Link>
        <div className={style.monthlyPayment}>
          {isPremium && `${fromGelText} ${monthlyPayment?.toFixed(1)}`}
        </div>
      </div>
    </div>
  )
}

export default PlanSelection
