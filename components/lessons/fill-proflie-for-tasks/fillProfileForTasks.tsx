import Image from 'next/image';
import ProfileFormButtons from './buttons';
import 'react-phone-number-input/style.css';
import { useSession } from 'next-auth/react';
import { getUserProfileData } from '@utils/auth';
import { TaskData } from '@utils/lessons/getTask';
import UserProfileFields from './userProfileFields';
import { prepareJsonData } from '@utils/profileData';
import style from './fillProfileForTasks.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { ProfileData, PutData } from '@utils/profileEdit';
import giftIcon from '@public/themes/images/v2/gift_icon.png';
import React, { FormEvent, useEffect, useState } from 'react';
import ContactAndAgreementFields from './contactAndAgreementFields';
import { useRouter } from 'next/router';

interface Props {
  token: string | null;
  completedTasks?: TaskData[];
  isUserLoggedIn: boolean;
  setShowModal: (isModal: boolean) => void;
  getTasksHandler: () => void;
  setHasProfileData: (hasProfile: boolean) => void;
}

// setShowModal={setShowModal}
//           token={token}
//           completedTasks={completedTasks}
//           isUserLoggedIn={isUserLoggedIn}
//           getTasksHandler={() => {
//             getTasksHandler();
//           }}
//           setHasProfileData={setHasProfileData}

const FillProfileForTasks: React.FC<Props> = ({
  completedTasks,
  isUserLoggedIn,
  token,
  setShowModal,
  getTasksHandler,
  setHasProfileData,
}) => {
  const { t } = useTranslation();
  const [isShowingSecondSide, setIsShowingSecondSide] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [gender, setGender] = useState<number>(0);
  const { data: session } = useSession();
  const [showProfileFiller, setShowProfileFiller] = useState<boolean>(false);
  const [isUserProfileFormFilled, setIsUserProfileFormFilled] = useState<boolean>(false);
  const [profileData, setPRofileData] = useState<ProfileData | undefined>(
    undefined
  );
  const router = useRouter();
  const [firstFormData, setFirstFormData] = useState<any>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isShowingSecondSide) {
      setFirstFormData(prepareJsonData(e, phoneNumber));
      setIsShowingSecondSide(true);
    } else {
      const mergedData = { ...firstFormData, phoneNumber, gender };

      try {
        await PutData(mergedData, token);

        router.push('/dashboard');
        // getTasksHandler();
        // setHasProfileData(true);
        // setShowProfileFiller(false);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (token) {
          const responseData = await getUserProfileData(token || '');
          if (responseData && responseData.data) {
            const respData = responseData.data;

            if (respData.profile && respData.profile.lastName) {
              setShowProfileFiller(false);
              setShowModal(false);
            } else {
              setShowProfileFiller(true);
              setShowModal(true);
            }

            setPRofileData(responseData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProfileData();

    // if (profileData && profileData.profile && profileData.profile.lastName) {
    //   console.log('Last Name:', profileData.profile.lastName);
    //   // setShowProfileFiller(true)
    //   // setShowModal(true);
    // } else {
    //   console.log('Else ....');
    //   // setShowModal(false);
    // }
  }, [completedTasks]);

  const handleFormFilledStatus = (isFilled: boolean) => {
    setIsUserProfileFormFilled(isFilled); // Update state in the parent
  };

  if (!showProfileFiller) {
    return null;
  }

  return (
    //isUserLoggedIn &&
    showProfileFiller && (
      <div className={style.modal} id="modal">
        <form onSubmit={handleSubmit}>
          <div className={style.container}>
            <div className={style.title}>
              <Image src={giftIcon} alt="" width={30} height={30} />
              <span>{t('FILL_PROFILE_FOR_TASKS_HEADER')}</span>
            </div>
            <div className={style.form}>
              {!isShowingSecondSide ? (
                <UserProfileFields setIsFormFilled={handleFormFilledStatus} />
              ) : (
                <ContactAndAgreementFields
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  gender={gender}
                  setGender={setGender}
                  setIsFormFilled={handleFormFilledStatus}
                />
              )}
              <ProfileFormButtons
                isShowingSecondSide={isShowingSecondSide}
                onSubmit={() => handleSubmit}
                onClose={() => {
                  setShowProfileFiller(false);
                  setHasProfileData(true);
                }}
                isFormFilled={isUserProfileFormFilled}
              />
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default FillProfileForTasks;
