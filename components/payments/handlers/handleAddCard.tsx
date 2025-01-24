import { changeCreditCard } from '@utils/getUserPayemnts';
import Swal from 'sweetalert2';
import createSwalHtml from '../paymentsSwal';
import style from '../../../pages/payments.module.scss';
import { Session } from 'next-auth';

export const handleAddCard = async (
  e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
  session: Session,
  t: (key: string) => string,
  paymentImage: { src: string }
) => {
  e.preventDefault();
  if (!session) return;

  try {
    const initialResponse = await changeCreditCard(session.user.accessToken, true);

    const swalConfig = {
      confirmButtonText: t('PAYMENTS_CHANGE_CREDIT_CARD'),
      showCloseButton: true,
      customClass: {
        confirmButton: style.swalConfirmButton,
        popup: style.swalPopup
      },
    };

    if (['RECURRING', 'RECURRING_SUBSCRIPTION'].includes(initialResponse.stack)) {
      const htmlContent = createSwalHtml(
        t('PAYMENTS_CHANGE_CREDIT_CARD'),
        t(initialResponse.stack === 'RECURRING' ? 'PAYMENTS_RECURRING_TO_CHANGE_CARD' : 'PAYMENTS_RECURRING_SUBSCRIPTION_CHANGE_CARD'),
        {
          paymentImageSrc: paymentImage.src,
          ...(initialResponse.stack === 'RECURRING' && {
            paymentText: t('PAYMENTS_RECURRING_HAVE_TO_PAY'),
            price: initialResponse.data.price,
            currency: initialResponse.data.currency,
          }),
        }
      );

      const userPrompt = await Swal.fire({
        ...swalConfig,
        html: htmlContent,
      });

      if (userPrompt.isConfirmed) {
        const finalResponse = await changeCreditCard(session.user.accessToken, false);
        window.open(finalResponse.data, '_blank');
      }
    } else {
      window.open(initialResponse.data, '_blank');
    }
  } catch (error) {
    console.error('Failed to process order:', error);
  }
};