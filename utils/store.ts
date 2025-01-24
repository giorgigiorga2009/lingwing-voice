import { ModalState } from '@/Types/modalStoreTypes';
import { create } from 'zustand';
import { debounce } from './modalManagement/index';
import axios from 'axios';
import { persist } from 'zustand/middleware';

interface UseProfileStore {
  isPassword: boolean;
  setIsPassword: (value: boolean) => void;
}

export const useProfileStore = create<UseProfileStore>()((set) => ({
  isPassword: false,
  setIsPassword: (value: boolean) => set({ isPassword: value }),
}));
interface SelectedCurrency {
  selectedCurrency: number;
  changeCurrency: (newCurrency: number) => void;
}

export const useStore = create<SelectedCurrency>()((set) => ({
  selectedCurrency: 0,
  changeCurrency: (newCurrency: number) =>
    set({ selectedCurrency: newCurrency }),
}));

export interface UserInfo {
  Token: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  SetToken: (token: string) => void;
  SetLastName: (lastName: string) => void;
  SetFirstName: (firstName: string) => void;
  SetEmail: (email: string) => void;
  SetAvatar: (avatar: string) => void;
}

// export const useUserStore = create<UserInfo>((set) => ({
//   Token: '',
//   SetToken: (token: string) => set({ Token: token }),
// }));

export const useUserStore = create<UserInfo>()(
  persist(
    (set) => ({
      Token: '',
      firstName: '',
      lastName: '',
      email: '',
      avatar: '',
      SetToken: (token: string) => set({ Token: token }),
      SetFirstName: (firstName: string) => set({ firstName: firstName }),
      SetLastName: (lastName: string) => set({ lastName: lastName }),
      SetEmail: (email: string) => set({ email: email }),
      SetAvatar: (avatar: string) => set({ avatar: avatar }),
    }),
    {
      name: 'user',
      getStorage: () => localStorage,
    }
  )
);

interface LocaleState {
  locale: string;
  setLocale: (newLocale: string) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale:
    typeof window !== 'undefined'
      ? localStorage.getItem('locale') || 'en'
      : 'en',
  setLocale: (newLocale: string) => set({ locale: newLocale }),
}));

export const initializeLocale = async (): Promise<string> => {
  try {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale) {
      return storedLocale;
    }

    const response = await axios.get('https://ipapi.co/json/');
    const data = response.data;
    const country: string = data.country_code;

    const defaultLocales: { [key: string]: string } = {
      GE: 'ka',
      en: 'en',
      ru: 'ru',
      tr: 'tr',
      bn: 'bn',
      es: 'es',
    };
    const locale = defaultLocales[country];
    localStorage.setItem('locale', locale);
    return locale;
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return 'en';
  }
};

export interface Hints {
  HintShown: boolean;
  HintText: string;
  HintAudioURL: string;
  AudioPlayCases: string[];
  MistakeCount: number;
  SetHintShow: (show: boolean) => void;
  SetHintText: (hintText: string) => void;
  SetHintAudioURL: (hintAudioURL: string) => void;
  SetAudioPlayCases: (audioPlayCases: string[]) => void;
  SetMistakeCount: (mistakeCount: number) => void;
}

export const useTaskStore = create<Hints>((set) => ({
  HintShown: false,
  HintText: '',
  HintAudioURL: '',
  AudioPlayCases: [],
  MistakeCount: 0,
  SetHintShow: (show: boolean) => set(() => ({ HintShown: show })),
  SetHintText: (hintText: string) => set(() => ({ HintText: hintText })),
  SetHintAudioURL: (hintAudioURL: string) =>
    set(() => ({ HintAudioURL: hintAudioURL })),
  SetAudioPlayCases: (audioPlayCases: string[]) =>
    set(() => ({ AudioPlayCases: audioPlayCases })),
  SetMistakeCount: (mistakeCount: number) =>
    set(() => ({ MistakeCount: mistakeCount })),
}));

export interface Percent {
  statisticPercent: string;
  setStatisticPercent: (percent: string) => void;
}

export const useStatisticPercentStore = create<Percent>((set) => ({
  statisticPercent: '0',
  setStatisticPercent: (percent: string) => set({ statisticPercent: percent }),
}));

export interface VoiceRecognition {
  transcript: string;
  SetTranscript: (totranscriptken: string) => void;
}

export interface SoundState {
  soundAllowed: boolean;
  micAllowed: boolean;
  allowSound: (isAllowed?: boolean) => void;
  alloMic: () => void;
}

export const useSoundStore = create<{
  soundAllowed: boolean;
  micAllowed: boolean;
  allowSound: (isAllowed?: boolean) => void;
  alloMic: () => void;
}>((set) => ({
  soundAllowed: false,
  micAllowed: false,
  allowSound: (isAllowed = true) => set({ soundAllowed: Boolean(isAllowed) }),
  alloMic: () => set({ micAllowed: true }),
}));

export const useVoiceRecognition = create<VoiceRecognition>((set) => ({
  transcript: '',
  SetTranscript: (transcript) => set(() => ({ transcript: transcript })),
}));

export const getVoiceRecognition = (state: VoiceRecognition) => ({
  transcript: state.transcript,
  SetTranscript: state.SetTranscript,
});

export interface RecognitionActive {
  isRecordingActive: boolean;
  isListening: boolean;
  ToggleRecordingActive: (IsRecordingActive: boolean) => void;
  setListening: (listening: boolean) => void;
  isKeyboardVisible: boolean;
  setKeyboardVisible: (isVisible: boolean) => void;
}

export const useRecognitionActive = create<RecognitionActive>((set) => ({
  isRecordingActive: false,
  isListening: false,
  ToggleRecordingActive: (RecordingActive) =>
  set(() => ({ isRecordingActive: !RecordingActive })),
  setListening: (listening) => set({ isListening: listening }),
  isKeyboardVisible: true,
  setKeyboardVisible: (isVisible) => set({ isKeyboardVisible: isVisible }),
}));

export const getVoiceRecognitionActive = (state: RecognitionActive) => ({
  isRecordingActive: state.isRecordingActive,
  isListening: state.isListening,
  ToggleRecordingActive: state.ToggleRecordingActive,
  setListening: state.setListening,
  isKeyboardVisible: state.isKeyboardVisible,
  setKeyboardVisible: state.setKeyboardVisible,
});

// Update the VoiceActive interface
export interface VoiceActive {
  isVoicePlaying: boolean;
  ToggleVoicePlaying: (isVoicePlaying: boolean) => void;
}

export const useVoiceActive = create<VoiceActive>((set) => ({
  isVoicePlaying: false,
  ToggleVoicePlaying: (isVoicePlaying: boolean) =>
    set(() => ({ isVoicePlaying: isVoicePlaying })),
}));

export interface userType {
  UserType: 'premium' | 'free';
  isAdmin: boolean;
  SetPremiumStatus: (isPremium: boolean, isAdmin: boolean) => void;
}
export const useUserTypeStore = create<userType>((set, get) => ({
  UserType: 'free',
  isAdmin: false,
  SetPremiumStatus: (isPremium: boolean, isAdmin: boolean) =>
    set({ UserType: isPremium ? 'premium' : 'free', isAdmin }),
}));

const FIVE_HOURS = 5 * 60 * 60 * 1000;
export const useModalStore = create<ModalState>((set, get) => ({
  modals: [],
  currentModal: null,
  setModals: (modals) => set({ modals }),
  openModal: debounce((modalId: string) => {
    const modal = get().modals.find((modal) => modal._id === modalId);
    if (!modal) return;

    const now = Date.now();
    const lastShownTimestamp = localStorage.getItem(`lastShown_${modalId}`);
    const lastShown = lastShownTimestamp ? parseInt(lastShownTimestamp, 10) : 0;
    const { UserType } = useUserTypeStore.getState();

    if (now - lastShown > (modal.schedule ?? FIVE_HOURS)) {
      const counterKey = `modal_${modalId}_${UserType}_count`;
      const currentCount = parseInt(
        localStorage.getItem(counterKey) || '0',
        10
      );
      const maxShows =
        UserType === 'premium'
          ? modal.showNTimesForPremium
          : modal.showNTimesForFree;

      if (currentCount < maxShows) {
        set({ currentModal: modal });
        // this is responsible for delaying the local storage update, in case of re render it wont effect the appearance of modal
        setTimeout(() => {
          localStorage.setItem(counterKey, (currentCount + 1).toString());
          localStorage.setItem(`lastShown_${modalId}`, now.toString());
        }, 1500);
      }
    }
  }, 200),
  closeModal: () => set({ currentModal: null }),
}));


interface UIState {
  isFeedbackOpen: boolean;
  isSideMenuOpen: boolean;
  setSideMenuOpen: (open: boolean) => void;
  setFeedbackOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSideMenuOpen: false,
  isFeedbackOpen: false,
  setSideMenuOpen: (open: boolean) => set({ isSideMenuOpen: open }),
  setFeedbackOpen: (open: boolean) => set({ isFeedbackOpen: open }),
}));

/** useFocusStore */
interface FocusState {
  shouldRefocus: boolean;
  isMobile: boolean;
  setShouldRefocus: (value: boolean) => void;
  setIsMobile: (value: boolean) => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  shouldRefocus: true,
  isMobile: false,
  setShouldRefocus: (value) => set({ shouldRefocus: value }),
  setIsMobile: (value) => set({ isMobile: value }),
}));

// check for mobile devices
export const initializeMobileCheck = () => {
  const checkMobile = () => {
    useFocusStore.getState().setIsMobile(window.innerWidth <= 768);
  };

  if (typeof window !== 'undefined') {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', checkMobile);
    }
  };
};
