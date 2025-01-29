import React from 'react';

interface WaveShapeProps {}

export const WaveShape: React.FC<WaveShapeProps> = () => {
  const handleCelebrationsClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    // Background overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    overlay.style.zIndex = '999';

    // Main container
    const mainContainer = document.createElement('div');
    mainContainer.style.position = 'fixed';
    mainContainer.style.top = '53%';
    mainContainer.style.left = '50%';
    mainContainer.style.transform = 'translate(-50%, -50%)';
    mainContainer.style.width = '30%';
    mainContainer.style.height = '87.5%';
    mainContainer.style.backgroundColor = 'rgba(240, 241, 242, 0.90)';
    mainContainer.style.boxShadow = '0px 0px 4px 0px rgba(0, 0, 0, 0.25)';
    mainContainer.style.borderRadius = '20px';
    mainContainer.style.padding = '20px';
    mainContainer.style.zIndex = '1000';
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';
    mainContainer.style.gap = '20px';

    // Header box (white)
    const headerBox = document.createElement('div');
    headerBox.style.backgroundColor = 'white';
    headerBox.style.padding = '16px';
    headerBox.style.borderRadius = '16px';
    headerBox.style.textAlign = 'center';

    const title = document.createElement('h2');
    title.textContent = 'CHOOSE A CATEGORY';
    title.style.color = '#6B21A8';
    title.style.fontWeight = '600';
    title.style.fontSize = '18px';
    title.style.margin = '0';

    headerBox.appendChild(title);

    // Categories container
    const categoriesContainer = document.createElement('div');
    categoriesContainer.style.display = 'flex';
    categoriesContainer.style.flexDirection = 'column';
    categoriesContainer.style.gap = '16px';
    categoriesContainer.style.overflowY = 'auto';

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

    categories.forEach((category) => {
      const categoryBox = document.createElement('div');
      categoryBox.style.backgroundColor = 'white';
      categoryBox.style.borderRadius = '16px';
      categoryBox.style.padding = '12px';
      categoryBox.style.display = 'flex';
      categoryBox.style.alignItems = 'center';
      categoryBox.style.gap = '12px';

      const iconContainer = document.createElement('div');
      iconContainer.style.width = '80px';
      iconContainer.style.height = '80px';
      iconContainer.style.borderRadius = '50%';
      iconContainer.style.backgroundColor = category.bgColor;
      iconContainer.style.display = 'flex';
      iconContainer.style.alignItems = 'center';
      iconContainer.style.justifyContent = 'center';

      const iconImage = document.createElement('img');
      iconImage.src = category.icon;
      iconImage.style.width = '70px';
      iconImage.style.height = '70px';
      iconContainer.appendChild(iconImage);

      const textContainer = document.createElement('div');
      textContainer.style.flex = '1';

      const name = document.createElement('div');
      name.textContent = category.name;
      name.style.fontWeight = '500';
      name.style.fontSize = '14px';

      const progressContainer = document.createElement('div');
      progressContainer.style.display = 'flex';
      progressContainer.style.gap = '4px';
      progressContainer.style.alignItems = 'center';
      const currentScore = document.createElement('span');
      currentScore.textContent = category.progress.split('/')[0];
      currentScore.style.color = '#EC9506';
      currentScore.style.textAlign = 'center';
      currentScore.style.fontVariantNumeric = 'lining-nums proportional-nums';
      currentScore.style.fontFeatureSettings = "'dlig' on";
      currentScore.style.fontFamily = '"Noto Sans Georgian"';
      currentScore.style.fontSize = '14px';
      currentScore.style.fontStyle = 'normal';
      currentScore.style.fontWeight = '500';
      currentScore.style.lineHeight = '20px';
      currentScore.style.letterSpacing = '0.14px';
      currentScore.style.textTransform = 'uppercase';

      const separator = document.createElement('span');
      separator.textContent = '/';
      separator.style.color = '#3C3C3C';
      
      const maxScore = document.createElement('span');
      maxScore.textContent = category.progress.split('/')[1];
      maxScore.style.color = '#3C3C3C';
      maxScore.style.fontVariantNumeric = 'lining-nums proportional-nums';
      maxScore.style.fontFeatureSettings = "'dlig' on";
      maxScore.style.fontFamily = '"Noto Sans Georgian"';
      maxScore.style.fontSize = '14px';
      maxScore.style.fontStyle = 'normal';
      maxScore.style.fontWeight = '500';
      maxScore.style.lineHeight = '20px';
      maxScore.style.letterSpacing = '0.14px';
      maxScore.style.textTransform = 'uppercase';

      progressContainer.appendChild(currentScore);
      progressContainer.appendChild(separator);
      progressContainer.appendChild(maxScore);

      textContainer.appendChild(name);
      textContainer.appendChild(progressContainer);

      const button = document.createElement('button');
      button.textContent = category.status;
      button.style.display = 'flex';
      button.style.padding = '4px 10px';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      button.style.gap = '10px';
      button.style.borderRadius = '37px';
      button.style.border = 'none';
      button.style.fontSize = '14px';
      button.style.fontWeight = '500';
      button.style.cursor = 'pointer';

      if (category.status === 'CONTINUE') {
        button.style.backgroundColor = '#6B21A8';
        button.style.color = 'white';
      } else {
        button.style.backgroundColor = '#EC9506';
        button.style.color = 'white';
        button.style.boxShadow = '0px 1px 4px 0px rgba(0, 0, 0, 0.25) inset';
      }

      categoryBox.appendChild(iconContainer);
      categoryBox.appendChild(textContainer);
      categoryBox.appendChild(button);
      categoriesContainer.appendChild(categoryBox);
    });

    // Close button container for positioning
    const closeButtonContainer = document.createElement('div');
    closeButtonContainer.style.display = 'flex';
    closeButtonContainer.style.justifyContent = 'flex-end';
    closeButtonContainer.style.width = '100%';
    closeButtonContainer.style.padding = '8px';

    const closeButton = document.createElement('img');
    closeButton.src = '/themes/images/v2/voice/Xbutton.svg';
    closeButton.style.cursor = 'pointer';
    closeButton.style.width = '26px';
    closeButton.style.height = '26px';

    const closeModal = () => {
      document.body.removeChild(overlay);
      document.body.removeChild(mainContainer);
    };
          
    closeButton.onclick = closeModal;

    // Update outside click handler
    mainContainer.addEventListener('click', (e) => {
      if (e.target === mainContainer) {
        closeModal();
      }
    });

    closeButtonContainer.appendChild(closeButton);
    mainContainer.appendChild(closeButtonContainer);
    mainContainer.appendChild(headerBox);
    mainContainer.appendChild(categoriesContainer);

    document.body.appendChild(overlay);
    document.body.appendChild(mainContainer);
  };

  return (
    <div title="Invert Wave">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="360"
        height="142"
        style={{
          position: 'relative',
          transform: 'translateY(7rem)',
          borderTopRightRadius: '100%',
          zIndex: 3000,
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          overflow: 'visible',
          pointerEvents: 'auto',
        }}
        viewBox="0 0 360 142"
        fill="none"
      >
        <defs>
          <path id="wavePath1" d="M10 63.5 C100 35.5, 250 31.5, 350 55" />
        </defs>
        <g filter="url(#filter0_di_5032_50723)">
          <path
            d="M0.5 48.0002V0C132.045 0 255.164 30.4416 360 83.4309V140.383C257.587 82.1123 133.753 48.0851 0 48.0002Z"
            fill="#FCFCFC"
            style={{
              pointerEvents: 'visiblePainted',
            }}
          />
        </g>
        <defs>
          <filter
            id="filter0_di_5032_33408"
            x="0"
            y="-3"
            width="360"
            height="142"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5032_50723"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5032_50723"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="-3" />
          </filter>
        </defs>
        <text
          fill="purple"
          fontSize="20"
          transform="rotate(13.5, 136.5, -40)"
          style={{ cursor: 'pointer' }}
          onClick={handleCelebrationsClick}
        >
          <textPath href="#wavePath1" startOffset="50%" textAnchor="middle">
            CELEBRATIONS
            <tspan dx="1" dy="-7.5" transform="rotate(90, 0, 0)">
              ⌄
            </tspan>
          </textPath>
        </text>
      </svg>
    </div>
  );
};

interface InvertedWaveShapeProps {}

export const InvertedWaveShape: React.FC<InvertedWaveShapeProps> = () => {
  const handleLeisureActivitiesClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div title="Invert Wave">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="360"
        height="142"
        style={{
          position: 'relative',
          transform: 'translateY(7rem)',
          borderTopLeftRadius: '100%',
          zIndex: 3000,
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          overflow: 'visible',
          pointerEvents: 'auto',
        }}
        viewBox="0 0 360 142"
        fill="none"
      >
        <defs>
          <path id="wavePath2" d="M10 63.5 C100 35.5, 250 31.5, 350 55" />
        </defs>
        <g filter="url(#filter0_di_5032_33407)">
          <path
            d="M-0.5 83.4309V140.383C102.413 82.1123 226.247 48.0851 360 48.0002V0C227.955 0 104.836 30.4416 0 83.4309Z"
            fill="#FCFCFC"
            style={{
              pointerEvents: 'visiblePainted',
            }}
          />
        </g>
        <text
          fill="purple"
          fontSize="20"
          transform="rotate(-11, 230, -40)"
          style={{ cursor: 'pointer' }}
          onClick={handleLeisureActivitiesClick}
        >
          <textPath href="#wavePath2" startOffset="50%" textAnchor="middle">
            LEISURE ACTIVITIES
            <tspan dx="1" dy="-7.5" transform="rotate(90, 0, 0)">
              ⌄
            </tspan>
          </textPath>
        </text>
      </svg>
    </div>
  );
};
