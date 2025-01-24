import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import QRCodeImage from '../../../public/themes/images/v2/svgQrWrapper.svg';
import style from './QrCode.module.scss';
import { useTranslation } from '@utils/useTranslation';

interface QrCodeProps {
  isCustomPage?: boolean;
}

const QrCode: React.FC<QrCodeProps> = ({ isCustomPage }) => {
  const { t } = useTranslation();
  return (
    <div className={classNames(style.styleqrWrapper,{[style.customStyleqrWrapper]: isCustomPage})}>
      <span className={style.styleqrTitle}>{t('INDEX_PAGE_QR_SQAN_TEXT')}</span>
      <Image
        src={QRCodeImage}
        alt="QR Code"
        width={92}
        height={92}
        className={style.qrCode}
      />
    </div>
  );
};

export default QrCode;
