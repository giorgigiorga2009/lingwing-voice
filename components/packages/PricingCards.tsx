import classNames from 'classnames';
import { useUserStore, useStore } from '@utils/store';
import { useRouter } from 'next/router';
import { CaruselDot } from './CaruselDot';
import { Currency } from './CurrencyPicker';
import style from './PricingCards.module.scss';
import { MostPopular } from './MostPopular';
import { PackageButton } from './PackageButton';
import { PACKAGES_IMAGES } from '@utils/const';
import { FC, useEffect, useState, useRef } from 'react';
import { Features, FeatureDescs } from './Features';
import {
  FreePackageName,
  Duration,
  PackageTitles,
  SaveAmount,
} from './Duration';
import { getCheckedCoupon, getPackages, PackageData } from '@utils/getPackages';
import { FreePackagePrice, ReccuringPrice, TotalPrice } from './Prices';
import { DiscountedTotalPrice, ShowDiscountLabel } from './PromoPrices';
import useSwal from '@components/reusables/PricingCardsSwal';
import SaleBadge from './SaleBadge';
import PackageDetailedMessage from './PackageDetailedMessage';
import PackageCard from '@components/reusables/PackageCard';

interface scroll {
  scrollLeft: number;
  scrollWidth: number;
}

export let packageId: string;

const PricingCards: FC<{ showPackages: number[]; coupon: string }> = ({
  showPackages,
  coupon,
}) => {
  const selectedCurrency = useStore((state) => state.selectedCurrency);
  const token = useUserStore((state) => state.Token);
  const cardRef = useRef<HTMLDivElement>(null!);
  const router = useRouter();
  const getCoupon = router.query.coupon as string;
  const [packagesData, setPackagesData] = useState<PackageData>();
  // const [selectedCurrency, setSelectedCurrency] = useState(0)
  const [currentCard, setCurrentCard] = useState(0);
  const { showSwal, t } = useSwal(); // Use the custom hook

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      try {
        const response = await getPackages(coupon === '' ? getCoupon : coupon);
        setPackagesData(response);
        if (!response || !response.coupon) {
          return;
        }
        const exists = response.coupon.exists;
        const alreadyUsed = response.coupon.isUsageExceded;
        const isValid = response.coupon.isValid;
        if (response?.coupon?.type === 'bonusTasks') {
          const body = {
            code: coupon,
            currency: selectedCurrency === 0 ? 'GEL' : 'USD',
            deviceType: 0,
          };
          const res = await getCheckedCoupon({ coupon, token, body });
          const isOkay = res?.status === 200;
          const isNotOkay = res?.status !== 200;
          const type = res?.data?.type === 'bonusTasks';

          if (isOkay && type) {
            showSwal(
              t('COUPON_FREE_TASKS'),
              t('SWAL_RESET_CLOSE_BUTTON'),
              'success'
            );
          } else if (isNotOkay) {
            showSwal(
              t('COUPON_FREE_TASKS_ALREADY_USED'),
              t('SWAL_RESET_CLOSE_BUTTON'),
              'warning'
            );
          }
        }
        if (!exists && !alreadyUsed && !isValid) {
          showSwal(t('COUPON_NOT_EXISTS'), t('SWAL_RESET_CLOSE_BUTTON'));
        } else if (exists && alreadyUsed && !isValid) {
          showSwal(t('COUPON_USAGE_EXCEDED'), t('SWAL_RESET_CLOSE_BUTTON'));
        } else if (exists && !alreadyUsed && !isValid) {
          showSwal(t('COUPON_IS_NOT_VALID'), t('SWAL_RESET_CLOSE_BUTTON'));
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      }
    };

    fetchData();
  }, [router.isReady, coupon]);


  if (!packagesData) return null;

  const CaruselDots: FC = () => {
    return (
      <div className={style.carusel__dots__container}>
        <div  className={style.carusel__dots__container_inner}>
          {packagesData.packages
            .filter((item, index) => showPackages.includes(index))
            .map((item, index) => (
              <CaruselDot
                key={index}
                index={index}
                current={currentCard}
                scrollHandler={() => {
                  cardRef.current.children[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                  })}
                }
                duration={item.duration}
              />
            ))}
          </div>
      </div>
    );
  };

  const handlePackageId = (id: string) => {
    packageId = id;
  };

  return (
    <>
      <div className={style.package__container}>
        <div>
          <div className={style.currencies}>
            {packagesData.currencies.map((currency, index) => (
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
        </div>
        <div
          ref={cardRef}
          className={style.cards}
          onScroll={() => {
            const { scrollLeft, scrollWidth }: scroll = cardRef.current;
            setCurrentCard(
              Math.round(
                ((scrollLeft) / scrollWidth) * (cardRef.current.children.length + 1)
              )
            );
          }}
        >
            {packagesData.packages
            .filter((item, index) => showPackages.includes(index))
            .map((item, index) => (
              <PackageCard
                key={index}
                item={item}
                index={index}
                selectedCurrency={selectedCurrency}
                packageIdSetter={handlePackageId}
              />
            ))}
        </div>
      </div>
      <CaruselDots />
    </>
  );
};

export default PricingCards;
