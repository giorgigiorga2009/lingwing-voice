import { FC } from 'react';
import classNames from 'classnames';
import style from './LevelsBubble.module.scss';

interface Props {
  mistakesByLevel: number[];
  taskType?: 'grammarOrDialog';
  isCurrentTask?: boolean;
}

export const LevelsBubble: FC<Props> = ({
  mistakesByLevel,
  taskType,
  isCurrentTask,
}) => {
  if (isCurrentTask) {
    // console.log(mistakesByLevel);
  }
  return (
    <div
      className={
        taskType === 'grammarOrDialog'
          ? style.levelsContainer2
          : style.levelsContainer
      }
    >
      {mistakesByLevel &&
        mistakesByLevel.map((mistake, index) => (
          <div
            key={index}
            className={classNames(
              style.levels,
              style[mistake > -1 ? Boolean(mistake).toString() : ''],
              isCurrentTask && style.current
            )}
          />
        ))}
    </div>
  );
};
