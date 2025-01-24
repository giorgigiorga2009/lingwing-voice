import { FC } from 'react';
import ChangeMode from './ChangeMode';
import AllGrammar from './AllGrammar';
import Statistics from './Statistics';
import Vocabulary from './Vocabulary';
import style from './Wrapper.module.scss';
import { CourseObject } from '@utils/lessons/getTask';
import { Tabs } from '@components/header/LessonsSideMenu';
import classNames from 'classnames';
interface ChangeModeProps {
  currentCourseObject: CourseObject;
  token?: string;
  userKey?: string;
  languageFrom: string | string[] | undefined;
  tab: any;
  setTab: (tab: Tabs) => void;
  setLearnMode: (learnMode: number) => void;
  setIsHidden?: (isHidden: boolean) => void;
}

const Wrapper: FC<ChangeModeProps> = ({
  currentCourseObject,
  token,
  languageFrom,
  tab,
  userKey,
  setTab,
  setLearnMode,
  setIsHidden,
}) => {
  if (!token && !userKey) return null;

  return (
    <div className={classNames(style.container, style.secondary)}>
      <div className={style.wrapper}>
        <div className={style.btns}>
          <div
            className={style.goBack}
            onClick={() => setIsHidden && setIsHidden(false)}
          >
           
          </div>
          <div className={style.close} onClick={() => setTab('course')}>
           
          </div>
        </div>
        {tab === 'levels' && (
          <ChangeMode
            learnMode={currentCourseObject.learnMode}
            userCourseId={currentCourseObject._id}
            token={token}
            setTab={setTab}
            setLearnMode={setLearnMode}
          />
        )}
        {tab === 'grammar' && (
          <AllGrammar
            courseId={currentCourseObject.course._id}
            LanguageFrom={languageFrom}
            token={token}
            userKey={userKey}
          />
        )}
        {tab === 'vocabulary' && (
          <Vocabulary
            currentCourseObject={currentCourseObject}
            LanguageFrom={languageFrom}
            token={token}
          />
        )}
        {tab === 'statistics' && (
          <Statistics
            courseId={currentCourseObject._id}
            token={token}
            userKey={userKey}
          />
        )}
      </div>
    </div>
  );
};

export default Wrapper;
