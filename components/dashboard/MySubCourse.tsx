import Link from 'next/link';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import ActionBtns from './ActionBtns';
import style from './MySubCourse.module.scss';
import CertificateBtn from './certificateBtn';
import { useTranslation } from '@utils/useTranslation';
import { LanguageFrom} from '@utils/languages';

interface SubCourseProps {
  userCourseId?: string;
  certificate: boolean;
  name: string;
  _id: string;
  percent: string;
  iLearn?: {
    nameCode: string;
  };
  languageSubStandard: {
    name: string;
  };
  rating: number;
  allPassedTasks: number;
  slug: string;
  status: {
    start: boolean;
    continue: boolean;
    buy: boolean;
  };
  iLearnFromNameCode: string;
  iLearnFrom: any[];
}

interface Props {
  token?: string;
  subCourse: SubCourseProps;
  indexOfSubCourse: number;
  indexOfCourse: number;
  onResetCourse: () => void;
  setIsChooseLangFromModalOpen: (isOpen: boolean) => void;
  setChooseLangFromArray: (languages: LanguageFrom[]) => void;
  setTargetCourseData: (data: any) => void;
}

const parseAndFormatFloat = (value: string | number): string => {
  const floatValue = parseFloat(value.toString());
  if (!isNaN(floatValue)) {
    return floatValue.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return '0.0';
  }
};

const MySubCourse: FC<Props> = ({
  token,
  subCourse,
  indexOfSubCourse,
  indexOfCourse,
  onResetCourse,
  setIsChooseLangFromModalOpen,
  setChooseLangFromArray,
  setTargetCourseData,
}) => {
  const { t } = useTranslation();
  const [percent, setPercent] = useState(subCourse.percent);
  const [courseState, setCourseState] = useState(subCourse.allPassedTasks || 0);
  const [label, setLabel] = useState('');
  const [allPassedTask, setAllPassedTask] = useState<number>(
    subCourse.allPassedTasks
  );
  const [continueBtn, setContinueBtn] = useState<boolean>(
    subCourse.status.continue
  );
  const [startBtn, setStartBtn] = useState<boolean>(subCourse.status.start);
  const languageTo = subCourse.iLearn?.nameCode;
  let languageFrom = subCourse.iLearnFromNameCode;
  const courseName = subCourse.slug;
  const slug = subCourse.slug;
  const handleResetCourse = () => {
    setAllPassedTask(0);
    setPercent('0');
    setContinueBtn(false);
    setStartBtn(true);

    onResetCourse();
  };

  // const updateCourseState = (num : number) => {

  //   let title = '';
  //   if(num <= 0) {
  //     title = 'start';
  //   } else if(subCourse.status.buy) {
  //     title = 'buy';
  //   } else if(subCourse.status.continue) {
  //     title = 'continue';
  //   }

  //   setLabel(title);
  // }

  const updateCourseState = useCallback(
    (num: number) => {
      let title = '';
      if (num <= 0) {
        title = 'start';
      } else if (subCourse.status.buy) {
        title = 'buy';
      } else if (subCourse.status.continue) {
        title = 'continue';
      }

      setLabel(title);
    },
    [subCourse.status.buy, subCourse.status.continue]
  );



  //   console.log('=========> <==========')
  //   if(subCourse.iLearn && subCourse.iLearn.nameCode && subCourse.iLearnFromNameCode && slug) {
  //     router.push(`aboutCourse?languageTo=${subCourse.iLearn && subCourse.iLearn.nameCode }&languageFrom=${subCourse.iLearnFromNameCode}&courseName=${slug}`);
  //   }
  // }

  // useEffect(() => {

  //   if(subCourse){
  //     updateCourseState(subCourse.allPassedTasks || 0);
  //   }
  // }, [subCourse , subCourse.status , subCourse.allPassedTasks  , updateCourseState])

  useEffect(() => {
    if (subCourse) {
      updateCourseState(subCourse.allPassedTasks || 0);
    }
  }, [
    subCourse,
    subCourse.status,
    subCourse.allPassedTasks,
    updateCourseState,
  ]);

  // console.log('boutCourse?languageTo=eng&languageFrom=geo&courseName=english_a2-1', subCourse)

  const formattedValue = useMemo(
    () => parseAndFormatFloat(subCourse.percent),
    [subCourse.percent]
  );

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {

    if(label === 'buy') return;

    const targetLocaleCourse = subCourse?.iLearnFrom?.filter(
      (item: any) => item.nameCode === subCourse.iLearnFromNameCode
    );

    const existTargetLocaleCourse =
      targetLocaleCourse && targetLocaleCourse.length > 0;

    // if (!existTargetLocaleCourse) {
    //   languageFrom = subCourse.iLearnFrom[0].nameCode;
    //   console.log('languageFrom : ', languageFrom);
    //   console.log(
    //     'subCourse.iLearnFromNameCode : ',
    //     subCourse.iLearnFromNameCode
    //   );
    // }

    if (!existTargetLocaleCourse) {
      e.preventDefault();
      // const availableLanguages = subCourse.iLearnFrom.filter((item:any) => item.nameCode !== 'chi');
      const availableLanguages = subCourse.iLearnFrom || [];
      const readyArray = availableLanguages.length > 0 ? availableLanguages.map((item:any) => {
        return item.nameCode
      }) : []

      setTargetCourseData({
        languageTo: subCourse.iLearn?.nameCode,
        // languageTo: subCourse.iLearnFromNameCode,
        courseName: slug,
      })



      
      setChooseLangFromArray(readyArray);
      setIsChooseLangFromModalOpen(true);

      // console.log('languageFrom : ', readyArray);
      // console.log(
      //   'subCourse.iLearnFromNameCode : ',
      //   subCourse.iLearnFromNameCode
      // );
      // alert('This course is not available in the selected language.');
    }
  };

  return (
    <>
      <div
        className={classNames(
          style.container,
          indexOfSubCourse === 0 && indexOfCourse !== 0
            ? style.container_first_child
            : null
        )}
      >
        <div className={style.details}>
          <div className={style.details_1}>
            <span className={style.progress}>
              {label === 'start' ? '0.0' : formattedValue}
              {/* {percent && courseState !== 0 ? subCourse.percent : 0} */}
              <span className={style.percent}>%</span>
            </span>
            {subCourse.slug.includes('georgian') &&
            courseName.includes('alphabet') ? (
              <span className={`${style.alphabet}`}>Alphabet</span>
            ) : (
              <h6 className={style.title}>
                <span className={style.wizardCourse}>{t('wizardCourse')}</span>
                <span className={style.course_level}>
                  {subCourse.languageSubStandard.name}
                </span>
              </h6>
            )}
          </div>
          <ActionBtns
            // clickHandler = {clickHandler}
            // indexOfSubCourse={indexOfSubCourse}
            // courseId={subCourse._id}
            subCourse={subCourse}
            token={token}
            slug={slug}
            allPassedTasks={allPassedTask}
            rating={subCourse.rating}
            onResetCourse={handleResetCourse}
            setCourseState={updateCourseState}
            queryData={{
              languageFrom: subCourse.iLearn?.nameCode,
              languageTo: subCourse.iLearnFromNameCode,
              courseName: slug,
            }}
          />
        </div>
        {subCourse.certificate ? (
          <CertificateBtn
            userCourseId={subCourse.userCourseId}
            indexOfSubCourse={indexOfSubCourse}
          />
        ) : (
          <Link
            className={style.link}
            href={{
              pathname: label === 'buy' ? '/packages' : '/lessons/soundcheck',
              query:
                label === 'buy' ? {} : { languageTo, languageFrom, courseName },
            }}
            onClick={handleLinkClick}
          >
            <button className={style.start_course_btn}>
              {label === 'start' && t('startButton')}
              {label === 'continue' && t('APP_GENERAL_CONTINUE')}
              {label === 'buy' && t('APP_GENERAL_BUY')}
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

export default MySubCourse;
