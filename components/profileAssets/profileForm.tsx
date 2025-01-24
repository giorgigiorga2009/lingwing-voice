import Swal from 'sweetalert2';
import LeftSide from './leftSide';
import RightSide from './rightSide';
import { useSession } from 'next-auth/react';
import style from './profileForm.module.scss';
import { prepareJsonData } from '@utils/profileData';
import React, { useState, FormEvent, useEffect } from 'react';
import { PutData, ProfileData, GetProfileData } from '@utils/profileEdit';
import { useTranslation } from '@utils/useTranslation';
import router from 'next/router';
import { useProfileStore } from '@utils/store';
import Loader from '@components/loaders/loader';

const ProfileForm: React.FC = () => {
  const { t } = useTranslation()
  const { data: session } = useSession();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [data, setData] = useState<ProfileData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setIsPassword = useProfileStore((state) => state.setIsPassword);
  const [isUserProfileFormFilled, setIsUserProfileFormFilled] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (session?.user.accessToken) {
        const responseData = await GetProfileData(session.user.accessToken);
        setData(responseData);
        setIsPassword(responseData.isPassword);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (session?.user.accessToken) {
      fetchData();
    }
  }, [session]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = prepareJsonData(e, phoneNumber, profilePicture);

    try {
      if (session) {
        await PutData(jsonData, session?.user.accessToken);
        Swal.fire({
          html: `<span class="${style.swalText}">${t('APP_PROFILE_SAVED')}</span>`,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: style.confirmButton,
            popup: style.swalPopup
          }
        });
      }
      const timeoutId = setTimeout(()=>{
        router.push('/dashboard');
      }, 1000);

      // Clean up timeout if component unmounts
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleFormFilledStatus = (isFilled: boolean) => {
    setIsUserProfileFormFilled(isFilled); 
  };

    if (isLoading) {
      return  <Loader/>
    }

    return (
      <form className={style.profileContainer} onSubmit={handleSubmit}>
        <LeftSide data={data} onPhoneNumberChange={setPhoneNumber} setIsFormFilled={handleFormFilledStatus} />
        <RightSide
          data={data}
          ProfilePicture={profilePicture}
          onProfilePictureChange={setProfilePicture}
          isFormFilled={isUserProfileFormFilled}
        />
      </form>
    );
};

export default ProfileForm;