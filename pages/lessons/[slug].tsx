import { PageHead } from '@components/PageHead';
import { Header } from '@components/header/Header';
import { SoundCheck } from '@components/lessons/SoundCheck';
import Ratings from '@components/lessons/usersRating/Ratings';
import { useRouter } from 'next/router';
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import style from '../lessons.module.scss';
import FeedbackButton from '@components/lessons/combinedModals/FeedbackButton';
import BackgroundParrot from '@components/shared/BackgroundParrot';
import LearnMenu from '@components/lessons/learnMenu/LearnMenu';
import Feedback from '@components/lessons/combinedModals/Feedback';
import ProgressBar from '@components/lessons/ProgressBar';
import Wrapper from '@components/lessons/learnMenu/Wrapper';
import CombinedModalComponent from '@components/lessons/combinedModals/combinedModals';
import ChatHistory from '@components/lessons/ChatHistory';
import ChatCurrentTask from '@components/lessons/ChatCurrentTask';
import { getLevelColors } from '@utils/lessons/taskInputUtils';
import TaskWrapper from '@components/lessons/chat/TaskWrapper';
import loading from '@public/assets/images/loading.svg';
import Image from 'next/image';
import {
  useFocusStore,
  UserInfo,
  useSoundStore,
  useUserStore,
  useVoiceActive,
} from '@utils/store';
import { ParsedUrlQuery } from 'querystring';
import { CourseObject, TaskData } from '@utils/lessons/getTask';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useAuthentication } from '@/hooks/useAuthentication';
import SpeechRecognition from 'react-speech-recognition';
import { logHandler } from '@utils/lessons/taskUtils';
import { handleResetButton } from '@components/dashboard/SwalForms';
import { useTranslation } from '@utils/useTranslation';
import { random } from 'lodash';
import { getMyCoursesData } from '@utils/getMyCourses';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useAudioManagement } from '@/hooks/useAudioManagement';

const getUserToken = (state: UserInfo) => ({
  Token: state.Token,
});

const welcomeTask = [
  {
    taskType: 'welcome',
    taskText: {
      text: 'CHAT_WELCOME_TO_ENG',
      image: '/assets/images/welcome/lingo.gif',
    },
    correctText: 'correctText',
  },
  {
    taskType: 'welcome',
    taskText: {
      text: '',
      image: null,
    },
    correctText: 'correctText',
  },
  {
    taskType: 'welcome',
    taskText: {
      text: '',
      image: null,
    },
    correctText: 'correctText',
  },
  {
    taskType: 'welcome',
    taskText: {
      text: '',
      image: null,
    },
    correctText: 'correctText',
  },
  {
    taskType: 'welcome',
    taskText: {
      text: '',
      image: null,
    },
    correctText: 'correctText',
  },
  {
    taskType: 'welcome',
    taskText: {
      text: null,
      image: '',
    },
    correctText: 'correctText',
  },
  {
    taskType: 'welcome',
    taskText: {
      text: null,
      image: '',
    },
    correctText: 'correctText',
  },

  {
    taskType: 'welcome',
    taskText: {
      text: '',
      image: null,
    },
    correctText: 'correctText',
  },
];
let isDesktopSize = false;

if (typeof window !== 'undefined') {
  isDesktopSize = window.innerWidth >= 1023;
}

const Lessons: React.FC = () => {
  // References for various DOM elements
  const screenshotRef = useRef<HTMLDivElement>(null);
  const chatWrapperRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { setShouldRefocus } = useFocusStore(); 

  // Router to get query params and locale
  const router = useRouter();
  const { query, locale } = router;
  const {
    slug,
    languageTo,
    languageFrom,
    courseName,
    task,
    taskType,
    ordinalNumber,
  } = query as ParsedUrlQuery;

  const { t } = useTranslation();

  // Custom hooks for authentication and user data
  const { session } = useAuthentication();
  const Token = useUserStore((state) => state.Token);
  const { data: sessionData, status } = useSession();

  // Create a memoized active token
  const activeToken = useMemo(
    () => (status === 'authenticated' ? sessionData?.user?.accessToken : null),
    [status, sessionData?.user?.accessToken]
  );

  // Fetch user data using a custom hook
  const {
    isLoading,
    userKey,
    courseObj,
    tasksData,
    point,
    setPoint,
    getTasksList,
  } = useFetchUserData(
    Token,
    languageFrom as string,
    languageTo as string,
    courseName as string,
    task as string,
    taskType as string,
    ordinalNumber,
    sessionData,
    status
  );

  const { Play, isAudioPlaying, PlayFail, delayedFunction } =
    useAudioManagement();
  const { ToggleVoicePlaying, isVoicePlaying } = useVoiceActive();

  // logHandler(taskType + ' ' + ordinalNumber)

  // Fetch Sound Confirm Var
  const soundAllowed = useSoundStore((state) => state.soundAllowed);

  // State variables for various component states
  const [currentTaskState, setCurrentTaskState] = useState(null);
  const [currentTaskNumber, setCurrentTaskNumber] = useState<number | null>(0);
  const [isGrammarHeightCalled, setIsGrammarHeightCalled] =
    useState<boolean>(false);
  const [grammarHeight, setGrammarHeight] = useState<number>(0);
  const [showFeedBack, setShowFeedBack] = useState<boolean>(false);
  const [showTopScores, setShowTopScores] = useState<boolean>(true);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isReadyForNext, setIsReadyForNext] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<any>([]); // Initialize as empty
  const [learnMode, setLearnMode] = useState<number | null>(
    courseObj?.learnMode || null
  );

  const [isRatingOpen, setIsRatingOpen] = useState<boolean>(isDesktopSize);
  const [isHidden, setIsHidden] = useState(true);
  const [randomNumbers] = useState(
    [Math.floor(Math.random() * 9000) + 1000].map(String)
  );


  // const allowSound = useSoundStore((state:any) => state.allowSound);

  const isFirstCourse =
    courseObj &&
    courseObj.isOriginal !== 2 &&
    courseObj.uniquePassedTasks === 0;

  const [isPaused, setIsPaused] = useState(false);

  // Extract query string from router.asPath for constructing URLs
  const queryStr = (() => {
    if (typeof router.asPath === 'string') {
      const queryStringIndex = router.asPath.indexOf('?');
      if (queryStringIndex !== -1) {
        return router.asPath.substring(queryStringIndex + 1).trim();
      }
    }
    return '';
  })();

  const resetTaskAndState = useCallback(async () => {
    if (!commonProps) return;

    // Reset state
    setCurrentTaskNumber(0);
    // setCompletedTasks([]);
    setCurrentMessageIndex(0);
    setIsDone(false);
    setIsReadyForNext(false);

    // Re-fetch or re-initialize the task object
    await getTasksList(
      userKey as string,
      { ...courseObj, learnMode: learnMode } as CourseObject
    );

    setCurrentTaskState(null);
  }, [userKey, courseObj, learnMode, getTasksList]);

  const welcomeTaskRef = useRef(welcomeTask); // Reference to the welcomeTask array
  const taskIndexRef = useRef(0); // To keep track of the current index

  // Sync voice and audio playing states
  useEffect(() => {
    if (isVoicePlaying !== isAudioPlaying) {
      console.log('syncing voice and audio playing states');
      ToggleVoicePlaying(isAudioPlaying);
    }
  }, [isAudioPlaying]);

  // Welcome message effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isFirstCourse && languageTo && languageFrom) {
      intervalId = setInterval(() => {
        if (taskIndexRef.current < welcomeTaskRef.current.length) {
          const { taskText, correctText, taskType } =
            welcomeTaskRef.current[taskIndexRef.current];
          const { text, image } = taskText;
          const languageToUpperCase =
            (languageTo as string)?.toUpperCase() ?? '';
          const languageFromUpperCase =
            (languageFrom as string)?.toUpperCase() ?? '';
          const finalText =
            text !== null && image !== null
              ? `<p> ${t(
                  `WELCOME_MESSAGE_${languageFromUpperCase}_${languageToUpperCase}_${
                    taskIndexRef.current + 1
                  }`
                )} </p>`
              : text !== null
              ? t(
                  `WELCOME_MESSAGE_${languageFromUpperCase}_${languageToUpperCase}_${
                    taskIndexRef.current + 1
                  }`
                )
              : '';

          let welcomeGif = `/assets/images/welcome/welcome_gifs/${languageFromUpperCase}_${languageToUpperCase}_${
            taskIndexRef.current + 1
          }.gif`;

          setCompletedTasks((prevTasks: any[]) => [
            ...prevTasks,
            // welcomeTaskRef.current[taskIndexRef.current],

            {
              taskType,
              correctText,
              taskText: ` 
              ${finalText} 

              ${
                image !== null
                  ? `<img src = "${image || welcomeGif}"  style = "width:100%;"  />`
                  : ''
              }
              `,
            },
          ]);

          taskIndexRef.current += 1;
          setShouldRefocus(true);
        } else {
          clearInterval(intervalId);
        }
      }, 2000);
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isFirstCourse, languageTo, languageFrom, t]);

  useEffect(() => {
    if (learnMode !== null) {
      resetTaskAndState();
    }
  }, [learnMode, resetTaskAndState]);

  // Scroll the chat container to the bottom
  const handleScroll = () => {
    if (
      chatRef &&
      chatRef.current &&
      chatWrapperRef &&
      chatWrapperRef.current
    ) {
      chatRef.current.scrollTop = chatWrapperRef.current.scrollHeight;
    }
  };

  // Handle dynamic height adjustment for grammar
  const handleGrammarHeight = (height: number) => {
    setGrammarHeight(height);
    setIsGrammarHeightCalled(true);
  };

  // Rating hide effect
  const handleHideAndRating = useCallback(() => {
    let hideTimeoutId: NodeJS.Timeout;

    setIsRatingOpen(false);
    hideTimeoutId = setTimeout(() => {
      setIsHidden(false);
    }, 100);

    // Return cleanup function
    return () => {
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
      }
    };
  }, []);

  // useEffect to handle automatic scrolling when the task changes
  useEffect(() => {
    if (!chatWrapperRef.current || !chatRef.current) return;
    if (isGrammarHeightCalled && grammarHeight === 0) return;

    let scrollTimeoutId: NodeJS.Timeout;

    scrollTimeoutId = setTimeout(() => {
      if (chatWrapperRef.current && chatRef.current) {
        if (grammarHeight !== 0) {
          chatRef.current.scrollTop =
            chatWrapperRef.current.scrollHeight - grammarHeight;
          setGrammarHeight(0);
        } else {
          chatRef.current.scrollTop = chatWrapperRef.current.scrollHeight;
        }
      }
    }, 200);

    setIsGrammarHeightCalled(false);

    // Cleanup timeout
    return () => {
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }
    };
  }, [
    currentTaskState,
    isGrammarHeightCalled,
    currentMessageIndex,
    currentTaskNumber,
    completedTasks.length,
    grammarHeight,
  ]);

  // Redirect to the soundcheck page if sound is not allowed and the current slug is not 'soundcheck'
  useEffect(() => {
    if (!slug) return;

    if (slug === 'soundcheck') {
      SpeechRecognition.stopListening();
      return;
    } else if (queryStr && slug === 'course' && !soundAllowed) {
      router.replace(`/lessons/soundcheck${queryStr ? '?' + queryStr : ''}`);
    }
  }, [slug, soundAllowed, router, queryStr]);

  const handleMyCourses = () => {
    // router.reload();
    const url = '/lessons/course/' + (queryStr ? '?' + queryStr : '');
    window.location.href = url;
    // if (Token) {

    //   return getMyCoursesData(Token).then((response) =>
    //     // setMyLanguages(response?.data?.languages),
    //     console.log(response)
    //   );
    // }
  };

  const onResetCourse = async () => {
    setIsHidden(true);
    const result = await handleResetButton(
      point,
      0,
      randomNumbers,
      courseName as string,
      activeToken ?? undefined,
      (num: number) => {
        console.log('');
      },
      handleMyCourses,
      t
    );

    if (result === 'canceled') {
      setIsHidden(true);
      router.push('/lessons/course/' + (queryStr ? '?' + queryStr : ''));
    }
  };

  // Check if all necessary props are defined before rendering components
  const propsDefined =
    (Token !== undefined || userKey !== undefined) &&
    languageTo !== undefined &&
    languageFrom !== undefined &&
    courseObj !== undefined;

  // Define common props for the TaskWrapper component
  const commonProps = propsDefined
    ? {
        userId: userKey || null,
        Token: Token || null,
        languageTo,
        languageFrom,
        courseId: courseObj?._id || '', // Add optional chaining to avoid errors
        setCurrentTaskNumber,
        currentTaskNumber,
        currentTask:
          tasksData[
            currentTaskNumber === null
              ? tasksData.length - 1
              : currentTaskNumber
          ],
        completedTasks,
        mistake: -1,
        setCompletedTasks,
        learnMode: learnMode ? learnMode : courseObj?.learnMode, // Add optional chaining to avoid errors
        course: {
          ...courseObj,
          learnMode: learnMode ? learnMode : courseObj?.learnMode,
        } as CourseObject,
      }
    : null;

  return (
    <div>
      {/* Page metadata for SEO */}
      <PageHead
        title={'META_TAG_ABOUTCOURSE_TITLE_' + (languageTo || 'geo')}
        description={
          'META_TAG_ABOUTCOURSE_DESCRIPTION_' + (languageTo || 'geo')
        }
        keywords={'META_TAG_ABOUTCOURSE_KEYWORDS_' + (languageTo || 'geo')}
      />

      {/* Feedback component */}
      {(courseObj as CourseObject) && showFeedBack && (
        <Feedback
        setOpenFeedback={() => {
          setShowFeedBack(false)
          setShowModal(false)
        }}
          currentCourseObject={courseObj as CourseObject}
          currentTaskData={
            tasksData[
              currentTaskNumber === null
                ? tasksData.length - 1
                : currentTaskNumber
            ]
          }
          screenshotRef={screenshotRef}
          token={Token || null}
          UserEmail={session?.user.email}
          locale={locale}
        />
      )}

      <div className={style.container} ref={screenshotRef}>
        {(courseObj as CourseObject) && (
          <>
            <Header
              size="s"
              currentCourseObject={courseObj || undefined}
              token={Token}
              setShowTopScores={setShowTopScores}
              showTopScores={showTopScores}
              setIsHidden={() => {
                setIsRatingOpen(false);
                setIsHidden(false);
              }}
              tab={slug as string}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
            />

            <CombinedModalComponent
              setShowModal={setShowModal}
              token={Token || null}
              courseName={courseName as string}
              courseId={(courseObj as CourseObject)?._id || ' '}
              isUserLoggedIn={!!Token}
              completedTasks={completedTasks}
              unAuthuserDailyLimit={
                (courseObj as CourseObject)?.course?.configuration
                  ?.unAuthUserDailyLimit as number
              }
              languageTo={languageTo as string}
              languageFrom={languageFrom as string}
              dailyTaskLeft={
                (courseObj as CourseObject)?.info.dailyTaskLeft as number
              }
              currentCourseObject={courseObj as CourseObject}
              dailyReachedLimitDate={
                (courseObj as CourseObject)?.dailyReachedLimitDate
                  ? new Date((courseObj as CourseObject).dailyReachedLimitDate)
                  : ''
              }
              getTasksHandler={() =>
                getTasksList(userKey as string, courseObj as CourseObject)
              }
            />
          </>
        )}

        {slug !== 'soundcheck' && (courseObj as CourseObject) && Token && (
          <Ratings
            userCourseId={(courseObj as CourseObject)._id}
            courseId={(courseObj as CourseObject).course._id}
            userScore={point || 0}
            token={Token}
            showTopScores={showTopScores}
            open={isRatingOpen}
            setOpen={setIsRatingOpen}
            setShowTopScores={setShowTopScores}
          />
        )}

        {slug !== 'soundcheck' && <BackgroundParrot />}

        <FeedbackButton
          setOpenFeedback={(state) => {
            setShowFeedBack(true);
            setShowModal(true);
          }}
          openFeedback={showFeedBack}
        />

        {slug === 'soundcheck' && (
          <SoundCheck
            setSoundChecked={() => {
              router.replace(
                `/lessons/course/${queryStr ? '?' + queryStr : ''}`
              );
            }}
            soundChecked={false}
          />
        )}

        {slug !== '' && slug !== 'soundcheck' && (courseObj as CourseObject) && (
          <>
            <LearnMenu
              languageTo={languageTo as string}
              languageFrom={languageFrom as string}
              setTab={(tab) => {
                setIsHidden(true);
                setIsRatingOpen(false);

                router.push(
                  '/lessons/' + tab + '/' + (queryStr ? '?' + queryStr : '')
                );
              }}
              tab={slug as string}
              token={Token as string}
              languageCourseId={(courseObj as CourseObject)?.course._id || ''}
              languageId={(courseObj as CourseObject)?.course.iLearn._id || ''}
              point={point}
              isHidden={isHidden}
              setIsHidden={setIsHidden}
              onResetCourse={onResetCourse}
              courseName={courseName as string}
              isRatingOpen={isRatingOpen}
              setIsRatingOpen={setIsRatingOpen}
              setShowTopScores={setShowTopScores}
              showTopScores={showTopScores}
            />

            <div
              // className={`${style.content}`}
              className={classNames(
                style.content,
                slug !== 'course' && style.secondary
              )}
            >
              {
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    transition: 'all 1s ease',
                    borderRadius: '1rem',
                    opacity: isLoading ? 1 : 0,
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(10px)',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    zIndex: isLoading ? 1000 : -1,
                  }}
                ></div>
              }

              <ProgressBar
                currentCourseObject={courseObj as CourseObject}
                userScore={point}
                liveCompletedTasks={completedTasks}
                tab={slug as string}
              />

              {slug !== 'course' && (
                <Wrapper
                  token={Token ?? ''}
                  currentCourseObject={
                    {
                      ...courseObj,
                      learnMode: learnMode ? learnMode : courseObj?.learnMode,
                    } as CourseObject
                  }
                  languageFrom={languageFrom}
                  setLearnMode={setLearnMode}
                  tab={slug}
                  userKey={userKey as string}
                  setTab={(tab) => {
                    router.push(
                      '/lessons/' + tab + '/' + (queryStr ? '?' + queryStr : '')
                    );
                  }}
                  setIsHidden={handleHideAndRating}
                />
              )}

              {slug === 'course' && (
                <div className={style.chatContainer}>
                  <div className={style.chat} ref={chatRef}>
                    <div ref={chatWrapperRef} className={style.chatWrapper}>
                      {completedTasks && (
                        <ChatHistory
                          completedTasks={completedTasks || []}
                          courseObj={
                            {
                              ...courseObj,
                              learnMode: learnMode
                                ? learnMode
                                : courseObj?.learnMode,
                            } as CourseObject
                          }
                          fetchType={
                            taskType
                              ? 'taskType'
                              : ordinalNumber
                              ? 'ordinalNumber'
                              : 'default'
                          }
                        />
                      )}

                      {(courseObj as CourseObject) &&
                        currentTaskNumber !== null &&
                        tasksData[currentTaskNumber] &&
                        (completedTasks.length > 7 || !isFirstCourse) && (
                          <ChatCurrentTask
                            fetchType={
                              taskType
                                ? 'taskType'
                                : ordinalNumber
                                ? 'ordinalNumber'
                                : 'default'
                            }
                            isReadyForNext={isReadyForNext}
                            currentTask={tasksData[currentTaskNumber]}
                            currentMessageIndex={currentMessageIndex}
                            isDone={isDone}
                            onDivHeight={handleGrammarHeight}
                            mistakesByLevel={getLevelColors({
                              currentTask: tasksData[currentTaskNumber],
                              currentCourseObject: {
                                ...courseObj,
                                learnMode: learnMode
                                  ? learnMode
                                  : courseObj?.learnMode,
                              } as CourseObject,
                              currentTaskState: currentTaskState,
                            })}
                            languageFrom={languageFrom}
                            Play={Play}
                          />
                        )}
                      {/* 
                      {!tasksData[currentTaskNumber] && (
                        <div className={style.blankBubble} />
                      )} */}
                    </div>
                  </div>

                  {tasksData[
                    currentTaskNumber === null ? 0 : currentTaskNumber
                  ] && (courseObj as CourseObject) ? (
                    <TaskWrapper
                      currentTaskState={currentTaskState}
                      setCurrentTaskState={setCurrentTaskState}
                      commonProps={commonProps}
                      setCurrentTaskNumber={setCurrentTaskNumber}
                      data={
                        tasksData[
                          currentTaskNumber === null
                            ? tasksData.length - 1
                            : currentTaskNumber
                        ]
                      }
                      getTasksHandler={() =>
                        getTasksList(
                          userKey as string,
                          courseObj as CourseObject
                        )
                      }
                      setCompletedTasks={setCompletedTasks}
                      completedTasks={completedTasks}
                      onDivHeight={handleGrammarHeight}
                      mistakesByLevel={getLevelColors({
                        currentTask:
                          tasksData[
                            currentTaskNumber === null
                              ? tasksData.length - 1
                              : currentTaskNumber
                          ],
                        currentCourseObject: courseObj as CourseObject,
                      })}
                      taskCount={tasksData.length}
                      currentTaskNumber={
                        currentTaskNumber === null
                          ? tasksData.length - 1
                          : currentTaskNumber
                      }
                      locale={languageTo}
                      handleScroll={handleScroll}
                      point={point}
                      setPoint={setPoint}
                      currentMessageIndex={currentMessageIndex}
                      setCurrentMessageIndex={setCurrentMessageIndex}
                      isDone={isDone}
                      isReadyForNext={isReadyForNext}
                      setIsReadyForNext={setIsReadyForNext}
                      setIsDone={setIsDone}
                      showModal={showModal}
                      setShowModal={setShowModal}
                      learnMode={learnMode}
                      chatRef={chatRef}
                      isPaused={isPaused}
                      isDisabled={isFirstCourse && completedTasks.length <= 7}
                      Play={Play}
                      isAudioPlaying={isAudioPlaying}
                      PlayFail={PlayFail}
                      delayedFunction={delayedFunction}
                    />
                  ) : (
                    <div className={style.loading}>
                      <Image
                        src={loading.src}
                        alt="Parrot holding torch"
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lessons;
