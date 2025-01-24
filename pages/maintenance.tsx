import React from 'react';
import style from './maintenance.module.scss';
import { NextPage } from 'next';

const Maintenance: NextPage = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.main}>
          <h1 className={style.title}>მიმდინარეობს პლატფორმის განახლება</h1>
          <p className={style.description}>
            ახალი პლატფორმა ხელმისაწვდომი იქნება 1 ოქტომბრიდან
          </p>
          <p className={style.comment}>
            მადლობას გიხდით მოთმინებისთვის
          </p>
        </div>
        <div className={style.imageContainer}/>
      </div>
    </>
  );
};

export default Maintenance;