// src/components/AssignQueryButton.tsx
import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import style from './Coupon.module.scss'

interface AssignQueryButtonProps {
  elementId: string;
}

const AssignQueryButton: FC<AssignQueryButtonProps> = ({ elementId }) => {
  const router = useRouter();

  useEffect(() => {
    const { scrollTo } = router.query;
    if (scrollTo === elementId) {
      const button = document.getElementById('assignQueryButton');
      if (button) {
        button.click();
      }
    }
  }, [router.query, elementId]);

  const handleClick = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('scrollTo', elementId);
    window.history.replaceState(null, '', newUrl.toString());
  };

  return (
    <button
      className={style.scrollButton}
      id="assignQueryButton"
      onClick={handleClick}
    >
      serves automatic scroll
    </button>
  );
};

export default AssignQueryButton;
