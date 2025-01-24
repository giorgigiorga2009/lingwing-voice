import React from 'react';
import Image from 'next/image';
import style from './paymentInfo.module.scss';
import { useTranslation } from '@utils/useTranslation';
import CupIcon from "../../public/themes/images/v2/cup.svg"
import MicIcpn from "../../public//themes/images/v2/paymentMicrophone.svg"
import FlagsIcon from "../../public/themes/images/v2/flagIcons.svg"

interface LanguageProgressProps {
    text: string;
    rightside:  React.ReactNode;
}

interface PaymentInfoProps {
    isPaymentMethodChosen: boolean;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ isPaymentMethodChosen }) => {
    const { t } = useTranslation();

    return (
        <div className={`${style.container} ${isPaymentMethodChosen ? style.noDecoration : ''}`}>
            <p className={style.header}>{t("APP_PACKAGE_SUMMARY")} </p>
            <PaymentInfoLine text={t("APP_PACKAGE_DAILY_NUMBER_OF_TASKS")} rightside={300} />
            <PaymentInfoLine text={t("APP_PACKAGE_ALL_LANGS_AND_COURSES")} rightside={<Image src={FlagsIcon} width={120} height={30} alt="cup" />} />
            <PaymentInfoLine text={t("APP_PACKAGE_VOICE_RECOGNITION")} rightside={<Image src={MicIcpn} width={15} height={20} alt="cup" />} />
            <PaymentInfoLine text={t("APP_PACKAGE_RAITING_ACCESS")} rightside={<Image src={CupIcon} width={15} height={15} alt="cup" />} />
        </div>
    )
}

const PaymentInfoLine: React.FC<LanguageProgressProps> = ({
 text,
 rightside
}) => {
  const { t } = useTranslation();

  return (
    <div className={style.wrapper}>
        <p>{text}</p>
    <div>
        {rightside}
    </div>
    </div>
  );
};
export default PaymentInfo;