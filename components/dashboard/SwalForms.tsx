import Swal from 'sweetalert2';
import style from './ActionBtns.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { resetCourse } from '@utils/deleteCourse';
import secondsToHms from '@components/reusables/SecondsToHms';
import { getStatistics } from '@utils/getStatistics';
import { getMyCoursesData } from '@utils/getMyCourses';

export const handleResetButton = async (
  allPassedTasks: number,
  rating: number,
  randomNumbers: string[],
  slug: string,
  token: string | undefined,
  setCourseState: { (num: number): void; (arg0: number): void },
  onResetCourse: (() => void) | undefined,
  t: { (id: string): string; (arg0: string): any }
) => {

 
  const result = await Swal.fire({
    title: t('SWAL_RESET_COUSE_TITLE'),
    text: token ? t('SWAL_RESET_COUSE_TEXT') : t('SWAL_RESET_COUSE_TEXT_NO_TOKEN'),
    icon: 'warning',
    showConfirmButton: true,
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonColor: 'rgb(110 120 129)',
    confirmButtonText: t('SWAL_RESET_BTN_OK'),
    cancelButtonText: t('SWAL_RESET_CLOSE_BUTTON'),
    cancelButtonColor: 'rgb(105 46 150)', 
    customClass: {
      popup: style.swalPopup
    }
  });




  const ratingLabel = rating > 0  ? `${t('SWAL_RESET_RATING')} - ${rating}` : '';

  if (result.isConfirmed) {

    if(!token){
      return 'canceled';
    }



    const secondChance = await Swal.fire({
      title: `${t('SWAL_RESET_PROGRESS')}: \n${t(
        'SWAL_RESET_SCORE'
      )} - ${allPassedTasks}\n${ratingLabel}`,
      text: t('SWAL_RESET_COUSE_TEXT'),
      icon: 'info',
      confirmButtonColor: 'rgb(110 120 129)',
      confirmButtonText: t('SWAL_RESET_BTN_OK'),
      cancelButtonColor: 'rgb(105 46 150)', 
      cancelButtonText: t('SWAL_RESET_CLOSE_BUTTON'),
      showCloseButton: true,
      showCancelButton: true,
      customClass: {
        popup: style.swalPopup
      }
    });

    if (secondChance.isConfirmed) {
      const finalWarning = await Swal.fire({
        title: t('ENTER_NUMBERS'),
        html: `
            <p>${t('ENTER_FOLLOWING_NUMBERS')}: ${randomNumbers}</p>
            <input id="swal-input" type="text" placeholder="Type numbers">
          `,
        showCancelButton: true,
        confirmButtonColor: 'rgb(110 120 129)',
        confirmButtonText: t('SWAL_RESET_BTN_OK'),
        cancelButtonText: t('SWAL_RESET_CLOSE_BUTTON'),
        cancelButtonColor: 'rgb(105 46 150)', 
        focusConfirm: false,
        customClass: {
          container: style.customSwalHeight,
          popup: `${style.swalPopup} `
        },
        preConfirm: () => {
          const inputValue = (
            document.getElementById('swal-input') as HTMLInputElement
          )?.value;

          if (inputValue === randomNumbers[0]) {
            return true;
          } else {
            Swal.showValidationMessage(t('SWAL_VALIDATION_ERROR'));
            return false;
          }
        },
      });

      if (finalWarning.isConfirmed) {
        try {
          const resp = await resetCourse({ slug, token });
          onResetCourse?.();

          if (resp && resp.courseSlug) {
            setCourseState(0);
          }
        } catch (error) {
          console.error('Failed to delete course:', error);
        }
      } else {
        return 'canceled';
      }
    } else {
      return 'canceled';
    }
  } else {
    return 'canceled';
  }
};


export const handleStatisticsButton = async (  
    token: string | undefined,
    subCourse: {
        userCourseId?: string;
      },
    t: { (id: string): string; (arg0: string): any }) => {
    if (token && subCourse.userCourseId) {
      try {
        const response = await getStatistics({
          courseId: subCourse.userCourseId,
          token: token,
        });  
        if (response) {

          const timeLeftFormatted = secondsToHms(response.timeLeft);

  
          await Swal.fire({
            html: `
              <div class="${style['statistics-container']}">
                <h2 class="${style.title}">${t("STATISTICS_COURSE")}</h2>
                <div class="${style['statistics-section']}">
                  <h3 class="${style['section-title']}">${t("STATISTICS_PROGRESS")}</h3>
                  <ul class="${style['statistics-list']}">
                    <li>${t("STATISTICS_PROGRESS_DONE")}: <span>${parseFloat(response.percent).toFixed(1)}%</span></li>
                    <li>${t("STATISTICS_RATING")}: <span>${response.rating}</span></li>
                    <li>${t("STATISTICS_RATING_POSIION")}: <span>${response.ratingPosition}</span></li>
                  </ul>
                </div>
                <div class="${style['statistics-section']}">
                  <h3 class="${style['section-title']}">${t("STATISTIC_TIME")}</h3>
                  <ul class="${style['statistics-list']}">
                    <li>${t("STATISTICS_COURSE_END_TIME")}: <span>${timeLeftFormatted}</span></li>
                    <li>${t("STATISTIC_SUM_PASSED_TASK_TIME")}: <span>${secondsToHms(response.totalTimeSpent)}</span></li>
                  </ul>
                </div>
                <div class="${style['statistics-section']}">
                  <h3 class="${style['section-title']}">${t("STATISTIC_SCORE")}</h3>
                  <ul class="${style['statistics-list']}">
                    <li>${t("STATISTIC_SUM_SCORE")}: <span>${response.sumAvailableScore}</span></li>
                    <li>${t("STATISTIC_COLLECTED_SCORE")}: <span>${response.collectedScore}</span></li>
                    <li>${t("STATISTIC_LEFT_SCORE_SUM")}: <span>${response.leftScore}</span></li>
                  </ul>
                </div>
                <div class="${style['bonus-section']}">
                  <h3 class="${style['section-title']}">${t("STATISTIC_BONUS")}</h3>
                    <span>${response.bonus}</span>
                  </ul>
                </div>
              </div>
            `,
            confirmButtonText: t("SWAL_RESET_CLOSE_BUTTON"),
            customClass: {
              container: style.swalStyle,
              popup: style.swalPopup,
              confirmButton: style.confirmButtonStyle,
            }
          });
        }
      } catch (error) {
        console.log('Error', error);
      }
    }
  };