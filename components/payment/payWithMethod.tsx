import React from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import styles from './payWithMethod.module.scss'
import purple_tick from '@public/assets/images/tick-check/bon-check-purple.png'
import { PaymentMethod } from '@utils/getPayments'
import { useTranslation } from '@utils/useTranslation'

interface Props {
  options?: PaymentMethod[]
  selectedOptionIndex: number
  payWithOption: string
  setPayWithOption: (payWithOption: string) => void
  isFreeTrialPage?: boolean
}

const PayWithMethod: React.FC<Props> = ({
  options,
  selectedOptionIndex,
  payWithOption,
  setPayWithOption,
  isFreeTrialPage = false,
}) => {
  const { t } = useTranslation()

  const filteredOptions =
    selectedOptionIndex === 0
      ? (options || []).filter(paymentType =>
          ['geopay', 'paypal'].includes(paymentType.nameCode),
        )
      : (options || []).filter(paymentType => paymentType.recurring)

  const handleOptionClick = (option: string) => {
    if (payWithOption === option) {
      setPayWithOption('')
    } else {
      setPayWithOption(option)
    }
  }

  return (
    <div className={styles.payWithContainer}>
      {(!['geopay', 'paypal'].includes(payWithOption) || isFreeTrialPage) && (
        <p className={styles.pHeaderPayWith}>{t('PAYMENT_METHOD')}</p>
      )}
      <div className={classNames(styles.payWithTiles, {
        [styles.selected]: payWithOption && !isFreeTrialPage,
        [styles.freeTrial]: isFreeTrialPage,
      })}>
        {filteredOptions.map(option => (
          <div
            className={classNames(styles.payWithTile, {
              [styles.selectedTile]: payWithOption === option.nameCode,
              [styles.freeTrialTile]: isFreeTrialPage,
            })}
            key={option.nameCode}
            onClick={() => handleOptionClick(option.nameCode)}
            onKeyDown={(e) => e.key === 'Enter' && handleOptionClick(option.nameCode)}
            tabIndex={0}
            role="button"
          >
            <input
              type="radio"
              name="payWithOptions"
              value={option.nameCode}
              checked={payWithOption === option.nameCode}
              onChange={() => setPayWithOption(option.nameCode)}
              className={classNames(styles.payWithInput, {
                [styles.freeTrialInput]: isFreeTrialPage,
              })}
              style={{
                backgroundImage: `url('/assets/images/payWithLogos/${option.logo}.png')`,
                // backgroundSize: '5rem',
              }}
            />
            {payWithOption === option.nameCode && (
              <Image
                className={styles.purple_tick_for_payment_option}
                src={purple_tick}
                width={20}
                height={20}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PayWithMethod
