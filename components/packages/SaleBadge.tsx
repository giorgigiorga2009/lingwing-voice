import React from 'react';
import styles from './SaleBadge.module.scss';

interface SaleBadgeProps {
  discount: number;
  className?: string;
}
 
const SaleBadge: React.FC<SaleBadgeProps> = ({ discount, className = '' }) => {
  return (
    <div className={`${styles.saleBadge} ${className}`}>
        <p>{discount}%</p>
    </div>
  );
};

export default SaleBadge;
