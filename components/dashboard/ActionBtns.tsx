import Link from 'next/link';
import { FC, useState } from 'react';
import style from './ActionBtns.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { handleResetButton, handleStatisticsButton } from './SwalForms';


interface ActionBtnsProps {
  // indexOfSubCourse: number
  // courseId: string
  subCourse: {
    userCourseId?: string;
  };
  rating: number;
  allPassedTasks: number;
  token?: string;
  slug: string;
  onResetCourse?: () => void;
  setCourseState: (num: number) => void;
  // clickHandler: (str:string) => void,
  queryData: any;
}

const ActionBtns: FC<ActionBtnsProps> = ({
  // indexOfSubCourse,
  // courseId,
  subCourse,
  rating,
  allPassedTasks,
  token,
  slug,
  onResetCourse,
  setCourseState,
  // clickHandler,
  queryData,
}) => {
  const { t } = useTranslation();
  const { languageFrom, languageTo, courseName } = queryData;
  const [randomNumbers] = useState(
    [Math.floor(Math.random() * 9000) + 1000].map(String)
  );
  

  return (
    <div className={style.container}>
      <Link href={`#`}>
        <button
          onClick={() => handleStatisticsButton(token, subCourse, t)}
          aria-label={t('SWAL_RESET_STATISTIC')}
          data-i18n-reset={t('SWAL_RESET_STATISTIC')}
          className={style.statistics}
        ></button>
      </Link>
      <Link href={`#`}>
        <button
          className={style.reset}
          onClick={() => handleResetButton(allPassedTasks, rating, randomNumbers, slug, token, setCourseState, onResetCourse, t)}
          data-i18n-reset={t('SWAL_RESET_RESET')}
          disabled={!allPassedTasks}
        ></button>
      </Link>
      <Link
        href={
          languageFrom && languageTo && courseName
            ? `aboutCourse?languageTo=${languageFrom}&languageFrom=${languageTo}&courseName=${courseName}`
            : '#'
        }
      >
        <button
          aria-label={t('SWAL_RESET_INFO')}
          data-i18n-reset={t('SWAL_RESET_INFO')}
          className={style.info}
          // onClick  = {() => clickHandler('about')}
        ></button>
      </Link>
    </div>
  );
};

export default ActionBtns;
