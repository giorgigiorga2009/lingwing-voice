import { FC } from 'react'
import { useRouter } from 'next/router'
import { PageTitle } from './PageTitle'
import { WizardTile } from './WizardTile'
import style from './ChooseLanguageStep.module.scss'
import { ContentContainer } from './ContentContainer'
import { LanguageFrom, LanguageTo } from '@utils/languages'
import { Back } from './BackIcon'

interface Props {
  languages: LanguageFrom[] | LanguageTo[]
  onClick: (language: LanguageFrom | LanguageTo) => void
  title: string
  language?: LanguageTo
}
export const ChooseLanguageStep: FC<Props> = ({
  languages,
  onClick,
  title,
  language,
}) => {
  
  return (
    <ContentContainer>
      <Back />
      <PageTitle languageTo={language} text={title} />
      <div className={style.container}>
        {languages.map(language => (
          <WizardTile
            key={language}
            language={language}
            onClick={() => onClick(language)}
          />
        ))}
      </div>
    </ContentContainer>
  )
}
