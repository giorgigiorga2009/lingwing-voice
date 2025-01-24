import React, { useCallback, useEffect, useState } from 'react'
import style from './GrammarWrapper.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { getAllGrammar } from '@utils/lessons/getAllGrammar';

const GrammarWrapper: React.FC<any> = ({
    courseId,
    languageFrom,
    token
}) => {


    const { t } = useTranslation()
    const [grammarObj, setGrammarObj] = useState([]);


    /** პრე რექვესტი    */
    const fetchData = useCallback(async () => {

        try {
            if (languageFrom && courseId) {

                const grammar = await getAllGrammar({ courseId, LanguageFrom: languageFrom, token });
            }

        } catch (error) {
            console.error('Error fetching user course:', error);
        }
    }, [languageFrom, courseId]);


    useEffect(() => {
        fetchData();
    }, [languageFrom, courseId])

    return (
        <div className={style.container}>
            <div className={style.title}>{t('GRAMMAR_TITLE')}</div>
            {/* {grammarData.map((grammar: Grammar, index) => (
                <div key={index} className={style.wrapper}>
                    <button
                        className={classNames(
                            style.grammarTitle,
                            clicked === index && style.open,
                        )}
                        onClick={() => {
                            fetchGrammarItem(grammar._id)
                            setClicked(clicked === index ? -1 : index)
                        }}
                    >
                        {grammar.title}
                    </button>
                    {index === clicked && (
                        <div
                            dangerouslySetInnerHTML={{ __html: grammarItem }}
                            className={classNames(
                                style.grammar,
                                index === clicked && style.open,
                            )}
                        />
                    )}
                </div>
            ))} */}
        </div>
    )
}

export default GrammarWrapper
