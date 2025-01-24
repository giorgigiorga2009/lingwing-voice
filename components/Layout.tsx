import { AssignPremiumStatus } from '@utils/getPremiumStatus';
import {
  useFetchModals,
  useModalLogic,
} from '@utils/modalManagement';
import { useModalStore } from '@utils/store';
import ModalComponent from './modal/ModalComponent';

const Layout = ({ children }: any) => {
  const { openModal, closeModal } = useModalStore();

  useFetchModals();
  AssignPremiumStatus()
  useModalLogic({ closeModal, openModal });

  return (
    <div>
      {children}
      <ModalComponent />
    </div>
  );
};

export default Layout;
