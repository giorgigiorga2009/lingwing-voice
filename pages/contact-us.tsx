import { Header } from '@components/header/Header'
import { FollowButtons } from '@components/home/FollowButtons'
import { PageHead } from '@components/PageHead'
import { Footer } from '@components/wizard/Footer'
import PostData from '@utils/contactUs'
import { UserInfo, useUserStore } from '@utils/store'
import { useTranslation } from '@utils/useTranslation'
import { useFormik } from 'formik'
import { NextPage } from 'next'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import * as Yup from 'yup'
import style from './contact-us.module.scss'
import { HomeFooter } from '@components/reusables/footer/HomeFooter'

const validationSchema = Yup.object({
  fullName: Yup.string().required('fullName is required').min(2).max(40),
  subject: Yup.string().required('Subject is required').min(2).max(50),
  text: Yup.string().required('Message is required').min(15).max(500),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .min(6)
    .max(50),
})

const ContactUs: NextPage = () => {
  const [fullnameAnim, setFullnameAnim] = useState(false)
  const [subjectAnim, setSubjectAnim] = useState(false)
  const [messageAnim, setMessageAnim] = useState(false)
  const [emailAnim, setEmailAnim] = useState(false)

  const { t } = useTranslation()
  const { Token } = useUserStore((state: UserInfo) => ({
    Token: state.Token,
  }));
  // Formik form handling with validation and submission logic
  const formik = useFormik({
    initialValues: {
      fullName: '',
      subject: '',
      text: '',
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await PostData(values, Token)
        Swal.fire({
          title: 'Successfully sent a message!',
          confirmButtonColor: '#8647b7',
          icon: 'success',
          confirmButtonText: 'Okey',
          customClass: {
            popup: style.swalPopup
          }
        })
        resetForm()
      } catch (error) {
        console.error('Error sending message:', error)
        Swal.fire({
          title: 'Message didnt sended try again!',
          confirmButtonColor: '#8647b7',
          icon: 'error',
          confirmButtonText: 'Close',
          customClass: {
            popup: style.swalPopup
          }
        })
      }
    },
  });
  // Event handlers for input onBlur events
  const handleBlur =
    (inputSetter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      removeClassName(e.target.value, inputSetter)
    }

  // Helper function to remove class names based on the input value
  const removeClassName = (
    value: string,
    stateUpdater: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (value === '') {
      stateUpdater(false)
    }
  }

  return (
    <div className={style.background}>
      <PageHead
        title="META_TAG_CONTACT_US_TITLE"
        description="META_TAG_CONTACT_US_DESCRIPTION"
        keywords="META_TAG_CONTACT_US_KEYWORDS"
      />
      <Header setShowTopScores={() => false} showTopScores={false}/>
      <div className={style.container}>
        <h1>{t('menuContactUs')}</h1>
        <h2>{t('APP_GET_IN_TOUCH')}</h2>
        <div className={style.Form}>
          <form onSubmit={formik.handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className={fullnameAnim ? style.labelanimUp : ''}
              >
                {t('FULL_NAME')}
              </label>
              <input
                onFocus={() => setFullnameAnim(true)}
                onBlur={handleBlur(setFullnameAnim)}
                onChange={formik.handleChange}
                value={formik.values.fullName}
                type="text"
                id="fullName"
              />
              {formik.touched.fullName && formik.errors.fullName ? (
                <em className={style.error}>{formik.errors.fullName}</em>
              ) : null}
            </div>
            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className={subjectAnim ? style.labelanimUp : ''}
              >
                {t('SUBJECT')}
              </label>
              <input
                type="text"
                id="subject"
                onFocus={() => setSubjectAnim(true)}
                onBlur={handleBlur(setSubjectAnim)}
                onChange={formik.handleChange}
                value={formik.values.subject}
              />
              {formik.touched.subject && formik.errors.subject ? (
                <em className={style.error}>{formik.errors.subject}</em>
              ) : null}
            </div>
            {/* Message */}
            <div className={style.message}>
              <label
                htmlFor="text"
                className={messageAnim ? style.labelanimUp : ''}
              >
                {t('APP_FEEDBACK_MESSAGE')}
              </label>
              <textarea
                id="text"
                onFocus={() => setMessageAnim(true)}
                onBlur={handleBlur(setMessageAnim)}
                onChange={formik.handleChange}
                value={formik.values.text}
              />
              {formik.touched.text && formik.errors.text ? (
                <em className={style.error}>{formik.errors.text}</em>
              ) : null}
            </div>
            {/* Email */}
            <div>
              <div id={style.emailandsubmit}>
                <label
                  htmlFor="email"
                  className={emailAnim ? style.labelanimUp : ''}
                >
                  {t('MODAL_EMAIL')}
                </label>
                <input
                  type="text"
                  id="email"
                  onFocus={() => setEmailAnim(true)}
                  onBlur={handleBlur(setEmailAnim)}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <em className={style.error}>{formik.errors.email}</em>
                ) : null}
                <button type="submit" value="Send">
                  {t('CONTACT_MESSAGE_SEND')}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className={style.footer}>
          <FollowButtons color="grey" isContactUs={true}/>
          <HomeFooter />
        </div>
      </div>
    </div>
  )
}

export default ContactUs
