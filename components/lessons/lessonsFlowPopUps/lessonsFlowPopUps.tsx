import React, { useCallback, useEffect, useState } from 'react';
import style from './lessonsFlowPopUps.module.scss';
import PopUpCircle from './popUpCircle';
import { regReminderTitle } from '@utils/const';
import { PaymentsProps, getUserPayements } from '@utils/getUserPayemnts';
import { RegistrationReminderPopupProps } from '@utils/lessons/getRegReminder';
import RenderHeaderContent from './renderHeaderContent';
import RenderParagraphContent from './renderParagraphContent';
import RenderCheckboxWithCardDetails from './renderCheckboxWithCardDetails';
import RenderButtons from './renderButtons';
import { PackageData, getPackages } from '@utils/getPackages';
import router from 'next/router';
import { LOCALES_TO_LANGUAGES } from '@utils/languages';
import { getReadCourse } from '@utils/getReadCourse';
import { useQuery } from 'react-query';

const LessonsFlowPopUps: React.FC<RegistrationReminderPopupProps> = ({
  token,
  courseName,
  popUpNumber,
  dailyLimitDate,
  packetTitle,
  completedTasks,
  languageTo,
  languageFrom,
}) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [paymentsData, setPaymentsData] = useState<PaymentsProps | null>(null);
  const [packagesData, setPackagesData] = useState<PackageData>();

  const handleOpenLogin = useCallback(() => setOpenLogin(true), []);

  useEffect(() => {
    if (popUpNumber === 3) {
      if (typeof token === 'string') {
        getUserPayements(token)
          .then((data) => setPaymentsData(data))
          .catch((error) =>
            console.error('Error fetching certificate:', error)
          );
      }
    }
  }, [popUpNumber, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPackages('');
        setPackagesData(response);
      } catch (err) {}
    };

    fetchData();
  }, []);

  const currentLanguage =
    router.locale &&
    LOCALES_TO_LANGUAGES[router.locale as keyof typeof LOCALES_TO_LANGUAGES];

  const fetchCourseData = async () => {
    if (currentLanguage && courseName) {
      try {
        const data = await getReadCourse(currentLanguage, courseName);
        return data;
      } catch (error) {
        throw new Error(String(error));
      }
    }
  };

  const { data: courseData } = useQuery(
    ['courseData', currentLanguage, courseName],
    fetchCourseData
  );

  return (
    <div className={style.regReminder}>
      <div className={style.container}>
        <RenderHeaderContent
          popUpNumber={popUpNumber}
          language={courseData?.title}
          token={token}
        />
        <div className={style.paragraph}>
          <RenderParagraphContent
            token={token}
            popUpNumber={popUpNumber}
            completedTasks={completedTasks}
            dailyLimitDate={dailyLimitDate}
            totalTasksAmount={courseData?.info.tasksQuantity}
            packetTitle={packetTitle}
          />
        </div>
        <div className={style.mainPart}>
          {regReminderTitle.map((item, index) => (
            <PopUpCircle
              popUpNumber={popUpNumber}
              key={index}
              {...item}
              handleOpenLogin={handleOpenLogin}
            />
          ))}
        </div>
        <div className={style.paragraph}>
          <RenderCheckboxWithCardDetails
            token={token}
            popUpNumber={popUpNumber}
            paymentsData={paymentsData}
          />
        </div>
        <div className={style.buttons}>
          <RenderButtons
            token={token}
            popUpNumber={popUpNumber}
            languageTo={languageTo}
            languageFrom={languageFrom}
            price={packagesData?.packages[1]?.currency[0]?.recurringPrice}
            duration={packagesData?.packages[1]?.duration}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonsFlowPopUps;
