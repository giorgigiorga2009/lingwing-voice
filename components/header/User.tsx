import Foco from 'react-foco';
import style from './User.module.scss';
import { useSession } from 'next-auth/react';
import UserAvatar from '../shared/UserAvatar';
import { UserDropdown } from './UserDropdown';
import { FC, useEffect, useState } from 'react';
import { getUserProfileData } from '@utils/auth';
import { useUserStore } from '@utils/store';
import classNames from 'classnames';

interface UserProfile {
  profile: {
    avatar: string;
    firstName: string | null;
    lastName: string | null;
  };
  local: {
    email: string | null;
  };
}

const User: FC<{isDarkMode: boolean}> = ({isDarkMode}) => {
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const { SetFirstName, SetLastName, SetEmail, SetAvatar } = useUserStore();

const handleUserProfile = () => {
  if (typeof window !== 'undefined' && session && session?.user) {
    return getUserProfileData(session.user.accessToken)
      .then((response) => {
        setUserData(response?.data);


        if (response?.data?.profile?.firstName) {
          SetFirstName(response.data.profile.firstName);
        }

        if (response?.data?.profile?.lastName) {
          SetLastName(response.data.profile.lastName);
        }

        if (response?.data?.local?.email) {
          SetEmail(response?.data?.local?.email);
        }

        if (response?.data?.profile?.avatar) {
          SetAvatar(response.data.profile.avatar);
        }

        return response;  
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
        throw error; 
      });
  }
};


  useEffect(() => {
    handleUserProfile();
  }, []);

  return (
    <Foco
      component="div"
      className={style.container}
      onClickOutside={() => setOpenDropdown(false)}
    >
      {userData && (
        <button
          className={classNames(style.button, { [style.darkMode]: isDarkMode })}
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          <UserAvatar
            image={userData.profile.avatar || session?.user.picture}
          />
          <p className={classNames(style.first_name, { [style.darkMode]: isDarkMode })}>
            {userData.profile.firstName
              ? userData.profile.firstName
              : session?.user.name ?? userData.local.email}
          </p>
          <div className={classNames(style.arrow, { [style.darkMode]: isDarkMode })} />
          {openDropdown && <UserDropdown />}
        </button>
      )}
      {session && !userData && (
        <button
          className={style.button}
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          <UserAvatar image={session.user?.picture} />
          <p className={style.first_name}>
            {session.user?.name ? session.user.name : session.user?.email}
          </p>
          <div className={style.arrow} />
          {openDropdown && <UserDropdown />}
        </button>
      )}
    </Foco>
  );
};

export default User;