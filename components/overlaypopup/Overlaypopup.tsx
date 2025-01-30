import Image from 'next/image';
import style from './Overlaypopup.module.scss';
const categories = [
  {
    name: 'GENERAL',
    progress: '36/3500',
    status: 'CONTINUE',
    icon: '/themes/images/v2/voice/CATEGORY/general.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'TRANSPORT',
    progress: '3/32',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/transport.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'SHOPPING',
    progress: '0/25',
    status: 'CONTINUE',
    icon: '/themes/images/v2/voice/CATEGORY/shopping.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'TRAVEL',
    progress: '16/25',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/travel.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'WORK',
    progress: '16/25',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/work.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'HOUSE',
    progress: '16/25',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/house.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'TECHNOLOGY',
    progress: '16/25',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/technology.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'SOCIAL SITUATIONS',
    progress: '16/25',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/socialsituations.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'HEALTH',
    progress: '0/25',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/health.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'EDUCATION',
    progress: '16/24',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/education.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'LEISURE ACTIVITIES',
    progress: '16/25',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/leisureactivities.svg',
    bgColor: '#F3E8FF',
  },
  {
    name: 'PUBLIC SERVICES',
    progress: '16/25',
    status: 'START',
    icon: '/themes/images/v2/voice/CATEGORY/publicservices.svg',
    bgColor: '#F3E8FF',
  },
];

let name = "giorgi";
let str1 = "hello";
console.log(str1 + " " + name);


const OverlayPopup = () => {
  return (
    <>
      <div className={style.overlay}>
        <div className={style.mainContainer}>
          {/* <div className={style.progressContainer}>
            <div className={style.currentScore}></div>
            <span className={style.seperator} ></span>
            <span className={style.maxScore}></span>
          </div> */}

          <div className={style.closeButtonContainer}>
            <img className={style.closeButton} />
          </div>

          <div className={style.headerBox}>
            <h2 className={style.title}> CHOOSE A CATEGORY</h2>
          </div>

          <div className={style.categoriesContainer}>
            {categories.map((category) => {
              return (
                <div className={style.categoryBox}>
                  <div className={style.iconContainer}>
                    <Image
                      className={style.iconImage}
                      src={category.icon}
                      alt={category.name}
                      width={80}
                      height={80}
                    />
                  </div>

                  <div className={style.textContainer}>
                    <div className={style.name}>{category.name}</div>
                    <div className={style.progressContainer}>
                      <span className={style.currentScore}>{category.progress.split('/')[0]}</span>
                      <span className={style.seperator}>/</span>
                      <span className={style.maxScore}>{category.progress.split('/')[1]}</span>
                    </div>
                  </div>
                  <button
                    className={style.button}
                    style={{
                      backgroundColor: category.status === 'CONTINUE' ? '#6B21A8' : '#EC9506',
                      boxShadow:
                        category.status === 'CONTINUE'
                          ? 'none'
                          : '0px 1px 4px 0px rgba(0, 0, 0, 0.25) inset',
                      // color: 'white',
                    }}
                  >
                    {category.status}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default OverlayPopup;
