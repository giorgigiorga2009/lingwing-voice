import Swal from 'sweetalert2';
import style from '../packages/PricingCards.module.scss';
import { useTranslation } from '@utils/useTranslation';

const useSwal = () => {
  const { t } = useTranslation();

  const showSwal = (
    html: string,
    confirmButtonText: string,
    icon?: 'success' | 'warning'
  ) => {
    Swal.fire({
      html: `<p class="${style.swalText}">${html}</p>`,
      confirmButtonText: confirmButtonText,
      customClass: {
        confirmButton: style.swalConfirmButton,
        popup: style.swalPopup,
      },
      icon: icon,
    });
  };

  return { showSwal, t };
};

export default useSwal;
