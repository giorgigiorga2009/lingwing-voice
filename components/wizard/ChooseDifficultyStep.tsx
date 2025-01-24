import { FC, useState } from 'react';
import { PageTitle } from './PageTitle';
import { ContentContainer } from './ContentContainer';
import style from './ChooseDifficultyStep.module.scss';
import { LanguageLevel } from '@utils/getDifficultyLevels';
import { useTranslation } from '@utils/useTranslation';
import { LanguageFrom, LanguageTo } from '@utils/languages';
import { DifficultyLevelContainer } from './DifficultyLevelContainer';
import { Back } from './BackIcon';

interface Props {
  levelData: LanguageLevel[];
  languageTo?: LanguageTo;
  languageFrom?: LanguageFrom;
}

export const ChooseDifficultyStep: FC<Props> = ({
  levelData,
  languageTo,
  languageFrom,
}) => {
  const { t } = useTranslation();
  const [openedSectionIndex, setOpenedSectionIndex] = useState<number | null>(
    null
  );
  return (
    <ContentContainer>
      <Back />
      <PageTitle
        languageFrom={languageFrom}
        languageTo={languageTo}
        text={t('wizardTitle3')}
      />
      <div className={style.levelsContainer}>
        {levelData.map((level, index) => (
          <DifficultyLevelContainer
            level={level}
            key={index}
            languageTo={languageTo}
            languageFrom={languageFrom}
            isOpened={openedSectionIndex === index}
            clickHandler={() =>
              openedSectionIndex === index
                ? setOpenedSectionIndex(null)
                : setOpenedSectionIndex(index)
            }
          />
        ))}
      </div>
    </ContentContainer>
  );
};
