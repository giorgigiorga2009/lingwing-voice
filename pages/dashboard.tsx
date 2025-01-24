import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import style from './dashboard.module.scss';
import { useSession } from 'next-auth/react';
import { PageHead } from '../components/PageHead';
import { LANGUAGE_NAMES, LanguageFrom, LANGUAGES_TO } from '../utils/languages';
import { Header } from '../components/header/Header';
import { Footer } from '../components/wizard/Footer';
import { useTranslation } from '../utils/useTranslation';
import { getMyCoursesData } from '../utils/getMyCourses';
import NoCourses from '../components/dashboard/NoCourses';
import MyLanguage from '../components/dashboard/MyLanguage';
import PromoSlider from '../components/dashboard/PromoSlider';
import { FollowButtons } from '../components/home/FollowButtons';
import DownloadAppBox from '../components/shared/DownloadAppBox';
import MyCourse, { SubCourse } from '../components/dashboard/MyCourse';
import { AddLanguageBtn } from '../components/dashboard/AddLanguageBtn';
import ChooseLangFromModal from '@components/dashboard/ChooselangFromModal';
import { HomeFooter } from '@components/reusables/footer/HomeFooter';

interface Standard {
  courses: SubCourse[];
  name: string;
  uniqueStudentsCount: number;
  smallDescription: string;
  fullDescription: string | null;
}

interface Language {
  _id: string;
  nameCode: string;
  standards: Standard[];
}

const Dashboard: NextPage = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState<string>();

  const [loading, setLoading] = useState<boolean>(true);
  const [myLanguages, setMyLanguages] = useState<Language[]>([]);
  const [activeLang, setActiveLang] = useState<number>(0);
  // const locale = router.locale ?? 'en'
  const { data: session } = useSession();

  const [isChooseLangFromModalOpen, setIsChooseLangFromModalOpen] =
    useState<boolean>(false);
  const [chooseLangFromArray, setChooseLangFromArray] = useState<any[]>([]);
  const [targetCourseData , setTargetCourseData] = useState<any>(null);
  // useEffect(() => {
  //   session && setToken(session?.user.accessToken)
  // }, [session])

  useEffect(() => {
    session && setToken(session?.user.accessToken);
    handleMyCourses();
    setLoading(false);
  }, [session]);

  const handleMyCourses = () => {
    if (session) {
      return getMyCoursesData(session.user.accessToken).then((response) =>
        setMyLanguages(response?.data?.languages)
      );
    }
  };

  const changeActiveLang = (indexOfLang: number) => {
    setActiveLang(indexOfLang);
  };

  const myCourse = myLanguages?.map((item: Language, indexOfLang: number) => {
    if (indexOfLang === activeLang) {
      return (
        <div key={item._id}>

          <ChooseLangFromModal
            isOpen={isChooseLangFromModalOpen}
            setIsOpen={setIsChooseLangFromModalOpen}
            languages={chooseLangFromArray}
            targetCourseData={targetCourseData}
          />

          {item.standards
            .filter((elem) => elem.courses.length > 0)
            .map((course, indexOfCourse) => {
              return (
                <MyCourse
                  token={token}
                  myLanguage={item}
                  course={course}
                  key={`${course.name}-${indexOfCourse}`}
                  LANGUAGE_NAMES={LANGUAGE_NAMES}
                  indexOfCourse={indexOfCourse}
                  handleResetNotification={handleMyCourses}
                  setIsChooseLangFromModalOpen={setIsChooseLangFromModalOpen}
                  setChooseLangFromArray={setChooseLangFromArray}
                  setTargetCourseData={setTargetCourseData}
                />
              );
            })}
        </div>
      );
    }
  });

  return (
    <div className={style.container}>
      <PageHead
        title="META_TAG_DASHBOARD_TITLE"
        description="META_TAG_DASHBOARD_DESCRIPTION"
        keywords="META_TAG_DASHBOARD_KEYWORDS"
      />
      <Header size="s" setShowTopScores={() => false} showTopScores={false} />
      {!loading && myLanguages && myLanguages.length > 0 && (
        <div className={style.content}>
          <div className={style.left_bar}>
            <h1 className={style.title}>{t('APP_DASHBOARD')}</h1>
            <h2 className={style.heading2}>{t('APP_GENERAL_MY_LANGUAGES')}</h2>
            <div>
              {myLanguages &&
                myLanguages.map(
                  (languageItem: Language, indexOfLang: number) => {
                    return (
                      <MyLanguage
                        key={languageItem._id}
                        languageItem={languageItem}
                        changeActiveLang={changeActiveLang}
                        activeLang={activeLang}
                        indexOfLang={indexOfLang}
                        t={t}
                        LANGUAGE_NAMES={LANGUAGE_NAMES}
                        myCourse={myCourse}
                      />
                    );
                  }
                )}
              <AddLanguageBtn />
              <div className={style.promo_slider_bottom}>
                <PromoSlider />
              </div>
              <DownloadAppBox />
            </div>
          </div>
          <div className={style.started_courses}>
            <h2 className={style.heading2}>
              {t('APP_GENERAL_STARTED_COURSES')}
            </h2>
            {myCourse}
          </div>
        </div>
      )}
      {myLanguages?.length === 0 && !loading && <NoCourses />}
      <FollowButtons dashboard={true} />
      {/* <Footer /> */}
      <HomeFooter />
    </div>
  );
};

export default Dashboard;
