import React from 'react';
import style from './ScrollDots.module.scss';
interface ScrollDotsProps {
  totalSections: number;
  currentSection: number;
  onDotClick: (index: number) => void;
}

const ScrollDots: React.FC<ScrollDotsProps> = ({
  totalSections,
  currentSection,
  onDotClick,
}) => {
  return (
    <div className={style.scrollDots}>
      {Array.from({ length: totalSections }, (_, index) => (
        <button
          type="button"
          key={index}
          className={`${style.dot} ${
            index === currentSection ? style.active : ''
          }`}
          onClick={() => {
            console.log('index : ', index);
            console.log('currentSection : ', currentSection);
            onDotClick(index);
          }}
        />
      ))}
    </div>
  );
};

export default ScrollDots;
