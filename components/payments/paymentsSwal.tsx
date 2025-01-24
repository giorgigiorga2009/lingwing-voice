import ReactDOMServer from "react-dom/server";
import Image from 'next/image';

export interface ChangeCardSwalProps {
    title: string;
    recurringText: string;
    paymentImageSrc?: any;
    paymentText?: string;
    price?: number | string;
    currency?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
    imageWidth?: number;
    imageHeight?: number;
  }
 
  type OmitTitleAndRecurringText = Omit<ChangeCardSwalProps, 'title' | 'recurringText'>;

  const ChangeCardSwalTitle: React.FC<ChangeCardSwalProps> = ({
    title,
    paymentImageSrc,
    recurringText,
    paymentText,
    price,
    currency,
    fontWeight,
    textAlign,
    imageWidth,
    imageHeight,
  }) => {
    return (
      <div>
        <h2
          style={{
            fontSize: '18px',
            borderBottom: '1px solid #d3d3d3',
            paddingBottom: '15px',
          }}
        >
          {title}
        </h2>
        {paymentImageSrc && (
          <div style={{ marginTop: '25px' }}>
            <Image src={paymentImageSrc} alt="Payment" width={imageWidth ?? 200} height={imageHeight ?? 150}/>
          </div>
        )}
        <h2
          style={{
            fontSize: '16px',
            textAlign: textAlign || 'left',
            color: 'rgb(150, 150, 150)',
            fontFamily: 'bpg_arial_2009',
            lineHeight: '20px',
            fontWeight: fontWeight || '300',
          }}
        >
          {recurringText}
        </h2>
        <p
          style={{
            color: 'rebeccapurple',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          {paymentText} {price}
          {currency}
        </p>
      </div>
    );
  };
  
  const createSwalHtml = (
    title: string,
    recurringText: string,
    options: OmitTitleAndRecurringText = {}
  ) => {
    const { paymentImageSrc, paymentText, price, currency, fontWeight, textAlign, imageWidth, imageHeight } = options;
    return ReactDOMServer.renderToString(
      <ChangeCardSwalTitle
        title={title}
        paymentImageSrc={paymentImageSrc}
        recurringText={recurringText}
        paymentText={paymentText}
        price={price}
        currency={currency}
        fontWeight={fontWeight}
        textAlign={textAlign}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      />
    );
  };

  export default createSwalHtml