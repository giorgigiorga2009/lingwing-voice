import { FC } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { PackageData } from '@utils/getPackages';
import { MostPopular } from '@components/packages/MostPopular';
import SaleBadge from '@components/packages/SaleBadge';
import { Duration, FreePackageName, PackageTitles, SaveAmount } from '@components/packages/Duration';
import { ShowDiscountLabel } from '@components/packages/PromoPrices';
import { FreePackagePrice, ReccuringPrice } from '@components/packages/Prices';
import { Features } from '@components/packages/Features';
import { PackageButton } from '@components/packages/PackageButton';
import style from './PackageCard.module.scss';
import { PACKAGES_IMAGES, PACKAGES_IMAGES_NEW } from '@utils/const';
import { useTranslation } from '@utils/useTranslation';

interface PackageCardProps {
  item: PackageData['packages'][0];
  index: number;
  selectedCurrency?: number;
  packageIdSetter: (id: string) => void;
  isFreeTrial?: boolean;
  isActive?: boolean;
}

const PackageCard: FC<PackageCardProps> = ({ item, index, selectedCurrency, packageIdSetter, isFreeTrial = false, isActive }) => {
  const { t } = useTranslation();
  
  return (
    <div
      key={index}
      id={index.toString()}
      className={classNames(
        style.package__card,
        { [style.freeTrialPackage__card]: isFreeTrial },
        { [style.mostPopular]: item.mostPopular }
      )}
    >
      {item.mostPopular && <MostPopular isFreeTrial={isFreeTrial} />}

      <PackageTitles title={t(item.title)} isFreeTrial={isFreeTrial} />

      {item.sale > 0 && <SaleBadge discount={item.sale} />}

      {item.duration === 0 ? (
        <FreePackageName /> 
      ) : (
        <Duration duration={item.duration} isFreeTrial={isFreeTrial} isMostPopular={item.mostPopular} />
      )}

      <SaveAmount title={item.mostPopular ? `${t('APP_GENERAL_FREE_TRIAL_SAVE_UP')} 47%` : ''} />

      <div className={classNames(style.package__card__image__wrapper, { [style.freeTrialPackage__card__image__wrapper]: isFreeTrial })}>
        <Image
          src={PACKAGES_IMAGES_NEW[item.duration]}
          alt="Parrot for package"
          className={classNames(
            item.mostPopular
              ? style.package__card__imageActive
              : style.package__card__image,
            { [style.freeTrialPackage__card__image]: isFreeTrial },
            item.duration == 3 ? style.package__card__image_3 : '',
            style.package__card__all
          )}
          width={265}
          height={200}
          priority={item.mostPopular}
        />
      </div>

      {item.duration === 0 ? (
        <FreePackagePrice /> 
      ) : (
        <ReccuringPrice
          price={item.currency[selectedCurrency ?? 0].recurringPrice}
          duration={item.duration}
          symbol={item.currency[selectedCurrency ?? 0]._id.symbol}
          isFreeTrial={isFreeTrial}
          sale={item.sale}
        />
      )}

      <div className={style.features__container}>
        <Features feature={item.feature} isFreeTrial={isFreeTrial} duration={item.duration}/>
      </div>
      
      <div className={style.button__container}>
        <PackageButton
          type={
            item.mostPopular
              ? 'mostPopularBtn'
              : 'regularPackageBtn'
          }
          onClick={() => packageIdSetter(item._id)}
          packageId={item._id}
          index={index}
          isFreeTrial={isFreeTrial}
          isActive={isActive}
        />
      </div>

      {!isFreeTrial && (
        <div className={style.detailedMessage}>
          <p>6-თვიანი პაკეტი ყველაზე ეკონომიურია, 5 დღეში თანხის დაბრუნებაც შეგიძლიათ.</p>
        </div>
      )}
    </div>
  );
};

export default PackageCard;