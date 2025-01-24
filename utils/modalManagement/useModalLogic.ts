import { useEffect } from 'react';
import { useModalStore, useUserStore, useUserTypeStore } from '@utils/store';
import { useRouter } from 'next/router';

interface UseModalLogicProps {
  closeModal: () => void;
  openModal: (modalId: string) => void;
}

export const useModalLogic = ({
  closeModal,
  openModal,
}: UseModalLogicProps) => {
  const router = useRouter();
  const Token = useUserStore.getState().Token;
  const UserType = useUserTypeStore.getState().UserType;

  useEffect(() => {
    const checkAndOpenModals = () => {
      closeModal();
      const now = new Date();
      const url = new URL(window.location.href);
      const pathParts = url.pathname.split('/').filter(Boolean);
      let page = pathParts.length === 0 ? 'home' : pathParts[0];
      const languageCode = ['en', 'ka', 'de', 'ru', 'tr', 'bn', 'es'];
      if (languageCode.includes(page)) {
        page = pathParts[1] ? pathParts[1] : 'home';
      }
      const queryParams = Object.fromEntries(new URLSearchParams(url.search));
      const state = useModalStore.getState();
      const applicableModals = state.modals.filter((modal) => {
        const modalStartDate = new Date(modal.startDate);
        const modalEndDate = modal.endDate
          ? new Date(modal.endDate)
          : new Date(8640000000000000);
        const isQueryMatch = Object.keys(queryParams).some((param) =>
          modal.pages.includes(`${param}=${queryParams[param]}`)
        );

        return (
          modal.pages.includes(page) ||
          (isQueryMatch && now >= modalStartDate && now <= modalEndDate)
        );
      });
      applicableModals.forEach((modal) => {
        if (modal.targetedAt === 'registered' && !Token) {
          return;
        } else if (modal.targetedAt === 'unRegistered' && Token) {
          return;
        } else if (modal.targetedAt === 'free' && UserType === 'premium') {
          return;
        } else if (modal.targetedAt === 'premium' && UserType === 'free') {
          return;
        }

        openModal(modal._id);
      });
    };
    checkAndOpenModals();

    const handleRouteChange = () => {
      checkAndOpenModals();
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, closeModal, openModal, Token, UserType]);
};
