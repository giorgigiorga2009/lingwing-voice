import React, { useEffect } from 'react'
import { useModalStore } from '@utils/store'
import style from './ModalComponent.module.scss'
import { useTranslation } from '@utils/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ModalWrapper from '@styles/styledComponents'

const ModalComponent = () => {
  const { currentModal, closeModal } = useModalStore()
  const { t, locale } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (currentModal && currentModal.autoCloseAfter > 0) {
      timer = setTimeout(() => {
        closeModal();
      }, currentModal.autoCloseAfter);
    }
    return () => clearTimeout(timer); 
  }, [currentModal, closeModal]);
  
  if (!currentModal) return null
  const navigate = (url: string) => {
    router.push(url)
  }

  const localizedText =
    currentModal?.content?.textLocales.find(l => l.language.name === locale)
      ?.text || currentModal?.content?.textLocales[0]?.text || ''

  const localizedInputText =
    currentModal.content.inputText.textLocales.find(
      l => l.language.name === locale,
    )?.text || currentModal?.content?.inputText?.textLocales[0]?.text || ''

  const localizedURLTitle =
    currentModal.content.link.title.find(l => l.language.name === locale)
      ?.text || currentModal.content.link.title[0].text || ''
  const aspectRation =
    currentModal.dimensions.height / currentModal.dimensions.width
  const tabletwidth = currentModal?.dimensions.width * 0.7
  const mobilewidth = tabletwidth * 0.6
  const tabletfontsize = currentModal?.content?.fontSize * 0.5
  const mobilefontsize = tabletfontsize * 0.6
  const modalStyle = {
    backgroundImage: currentModal.backgroundImageUrl
      ? `url(${process.env.NEXT_PUBLIC_AUDIO_URL}${currentModal.backgroundImageUrl})`
      : '',
    width: currentModal.dimensions.width,
    height: currentModal.dimensions.height,
    justifyContent: currentModal.content?.positions?.justifyContent,
    alignItems: currentModal.content.positions?.alignItems,
    cursor:
      currentModal.content.link.url && !currentModal.content.link.title
        ? 'pointer'
        : '',
        padding: '1rem'
  }

  const buttonStyles = {
    color: currentModal.content.link.button?.style.color || '',
    backgroundColor:
      currentModal.content.link.button?.style.backgroundColor || '',
    fontSize: `${currentModal.content?.fontSize}px`,
  }

  return (
    <div className={style.modalBackdrop}>
      <div className={style.container}>
        <ModalWrapper
          tabletwidth={`${tabletwidth}`}
          tabletheight={`${tabletwidth * aspectRation}`}
          mobilewidth={`${mobilewidth}`}
          mobileheight={`${mobilewidth * aspectRation}`}
          tabletfontsize={tabletfontsize}
          mobilefontsize={mobilefontsize}
          style={modalStyle}
        >
          {localizedText && (
            <div
              className={style.modalContent}
              dangerouslySetInnerHTML={{ __html: localizedText }}
            />
          )}
          {localizedInputText && (
            <div
              className={style.inputText}
              style={{
                color: currentModal.content?.inputText?.color,
                fontSize: `${currentModal.content?.fontSize}px`,
              }}
            >
              {localizedInputText}{' '}
              {!currentModal.content.link.button?.isBtn && (
                <Link
                  href={currentModal.content.link.url}
                  style={{
                    color: currentModal.content?.inputText?.urlTitleColor,
                  }}
                >
                  {localizedURLTitle}
                </Link>
              )}
            </div>
          )}
          {currentModal.content.link &&
            currentModal.content.link.button?.isBtn && (
              <button
                className={style.button}
                style={buttonStyles}
                onClick={() => window.open(currentModal.content.link.url, '_blank')}
                title={localizedURLTitle}
              >
                {localizedURLTitle}
              </button>
            )}
        </ModalWrapper>
        <button
          className={style.closeButton}
          onClick={closeModal}
          title={t('SWAL_RESET_CLOSE_BUTTON')}
        />
      </div>
    </div>
  )
}

export default ModalComponent
