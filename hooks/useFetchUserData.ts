import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  getUserCourse,
  getTasks,
  CourseObject,
  TaskData, 
} from '@utils/lessons/getTask';
import { getUserId } from '@utils/getUserId';
import { logHandler } from '@utils/lessons/taskUtils';

/**
 * Custom hook to fetch user data, course information, and tasks.
 *
 * @param Token - Authentication token of the user
 * @param languageFrom - Source language
 * @param languageTo - Target language
 * @param courseName - Name of the course
 * @param task - Task identifier
 * @returns An object containing userKey, courseObj, tasksData, point, setPoint, and getTasksList
 */
export const useFetchUserData = (
  Token: string | null,
  languageFrom: string,
  languageTo: string,
  courseName: string,
  task: string,
  taskType: any,
  ordinalNumber: any,
  sessionData: any,
  status: 'loading' | 'authenticated' | 'unauthenticated'
) => {

  
  const [userKey, setUserKey] = useState<string | null>(null);
  const [courseObj, setCourseObj] = useState<CourseObject | null>(null);
  const [tasksData, setTasksData] = useState<TaskData[]>([]);
  const [point, setPoint] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a memoized token selector
  const activeToken = useMemo(
    () => (status === 'authenticated' ? sessionData?.user?.accessToken : null),
    [status, sessionData?.user?.accessToken]
  );

  // On component mount, retrieve userKey from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = sessionStorage.getItem('userId');

      if (storedUserId) {
        setUserKey(storedUserId);
      }
    }
  }, []);

  /**
   * Fetch the list of tasks for a given user and course.
   *
   * @param user_id - ID of the user
   * @param course - Course object
   */
  const getTasksList = useCallback(
    async (user_id: string | null, course: CourseObject) => {
      try {
        if (languageFrom && languageTo && courseName) {
          const tasks = await getTasks({
            languageFrom,
            languageTo,
            Token: activeToken,
            courseId: course.course._id,
            userCourseId: course._id,
            userId: user_id || null,
            task,
            taskType,
            ordinalNumber,
          });

          if (tasks) {
            setTasksData(tasks);
          }
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    [
      languageFrom,
      languageTo,
      courseName,
      activeToken,
      task,
      taskType,
      ordinalNumber,
    ]
  );

  /**
   * Fetch the user ID and course information.
   */
  const fetchUserId = useCallback(async () => {
    try {

      logHandler('fetchUserId Triggered')
      logHandler(`
          languageFrom: ${languageFrom}
          languageTo: ${languageTo}
          courseName: ${courseName}
          activeToken: ${activeToken}
          userKey: ${userKey}
        `)

      if (languageFrom && languageTo && courseName) {
        let UID = userKey;

        if (!UID) {
          const resp = await getUserId({
            languageFrom,
            languageTo,
            courseName,
            Token: activeToken,
          });

          if (resp) {
            UID = resp;
            sessionStorage.setItem('userId', resp);
            setUserKey(resp);
          }
        }


        logHandler('getUserCourse Triggered')


        const courseOb = await getUserCourse({
          languageFrom,
          languageTo,
          courseName,
          Token: activeToken,
          userId: UID || null,
        });

        console.log('UID', courseOb);

        if (courseOb) {
          setCourseObj(courseOb);
          if (courseOb.score && courseOb.score > 0) {
            setPoint(courseOb.score);
          }
          await getTasksList(UID, courseOb);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  }, [
    languageFrom,
    languageTo,
    courseName,
    activeToken,
    getTasksList,
    userKey,
  ]);

  // Only fetch data when authentication status is determined
  useEffect(() => {


    setIsLoading(true);

    if (status === 'loading' || !languageFrom || !languageTo || !courseName) {
      return;
    }

    fetchUserId();
  }, [status , languageFrom, languageTo, courseName]); // Only depend on authentication status

  return {
    userKey,
    courseObj,
    tasksData,
    point,
    setPoint,
    getTasksList,
    isLoading,
  };
};
