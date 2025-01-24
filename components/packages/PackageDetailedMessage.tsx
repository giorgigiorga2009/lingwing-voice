import React from 'react';
import styles from './PackageDetailedMessage.module.scss';

interface PackageDetailedMessageProps {
  message: string;
}

const PackageDetailedMessage: React.FC<PackageDetailedMessageProps> = ({ message }) => {
  return (
    <div className={styles.detailedMessage}>
      <p>{message}</p>
    </div>
  );
};

export default PackageDetailedMessage;
