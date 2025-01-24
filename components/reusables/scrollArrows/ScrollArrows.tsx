import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import southArrow from '../../../public/themes/images/v2/southArrowWhite 3.svg';
import style from './SrollArrows.module.scss'

interface ScrollArrowsProps {
  numOfArrows: number; 
  isCustomPage?: boolean; 
  clickHandler: (index: number) => void;
  currentSection: number;
}

const ScrollArrows: React.FC<ScrollArrowsProps> = ({ numOfArrows, isCustomPage = false, currentSection, clickHandler }) => {
  return (
    <div className={classNames(style.arrowsWrapper, {
      [style.customArrowsWrapper]: isCustomPage
    })}   onClick={() =>  clickHandler(currentSection + 1)}>
      {Array.from({ length: numOfArrows }, (_, index) => (
        <Image
          key={index}
          src={southArrow}
          alt="Scroll Arrow"
          width={56}
          height={40}
          className={style.arrow}
        />
      ))}
    </div>
  );
};

export default ScrollArrows;
