import { FC, useState } from 'react'
import style from './LessonsSideMenu.module.scss'
import { CourseObject } from '@utils/lessons/getTask'
import AllGrammar from '@components/lessons/learnMenu/AllGrammar'
import ChangeMode from '@components/lessons/learnMenu/ChangeMode'
import Statistics from '@components/lessons/learnMenu/Statistics'
import Vocabulary from '@components/lessons/learnMenu/Vocabulary'

interface Props {
  currentCourseObject: CourseObject
  token?: string
}

export type Tabs =
  | 'course'
  | 'grammar'
  | 'vocabulary'
  | 'levels'
  | 'statistics';

export const LessonsSideMenu: FC<Props> = ({ currentCourseObject, token }) => {
  const [activeTab, setActiveTab] = useState<Tabs>('grammar')

  return (
    <div className={style.container}>
      <div className={style.content}>
        {activeTab === 'grammar' && (
          <AllGrammar
            courseId={currentCourseObject.course._id}
            LanguageFrom={'geo'}
            token={token}
          />
        )}
        {activeTab === 'levels' && (
          <ChangeMode
            userCourseId={currentCourseObject.course._id}
            learnMode={currentCourseObject.learnMode}
            token={token}
            setTab={tab => setActiveTab(tab)}
          />
        )}
        {activeTab === 'vocabulary' && (
          <Vocabulary
            currentCourseObject={currentCourseObject}
            LanguageFrom={'geo'}
            token={token}
          />
        )}
        {activeTab === 'statistics' && (
          <Statistics courseId={currentCourseObject._id} token={token} />
        )}
      </div>
      <div className={style.footerMenu}>
        <button
          className={`${style.statisticsIcon} ${
            activeTab === 'statistics' && style.activeButton
          }`}
          onClick={() => setActiveTab('statistics')}
        />
        <button
          className={`${style.grammarIcon} ${
            activeTab === 'grammar' && style.activeButton
          }`}
          onClick={() => setActiveTab('grammar')}
        />
        <button
          className={`${style.vocabularyIcon} ${
            activeTab === 'vocabulary' && style.activeButton
          }`}
          onClick={() => setActiveTab('vocabulary')}
        />
        <button
          className={`${style.changeModeIcon} ${
            activeTab === 'levels' && style.activeButton
          }`}
          onClick={() => setActiveTab('levels')}
        />
      </div>
    </div>
  )
}
