import styled from 'styled-components';

interface WrapperProps {
    tabletwidth: string | number;  
    tabletheight: string | number;
    mobilewidth: string | number;
    mobileheight: string | number;
    tabletfontsize: number;
    mobilefontsize: number;
  }

const ModalWrapper = styled.div<WrapperProps>`
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) and (max-width: 1023px) {
    width: ${props => props.tabletwidth}px !important;
    height: ${props => props.tabletheight}px !important;
    div{
      font-size: ${props => props.tabletfontsize}px !important;
    }
      button{
        font-size: ${props => props.tabletfontsize}px !important;
    }
  }
  @media (max-width: 767px) {
    width: ${props => props.mobilewidth}px !important;
    height: ${props => props.mobileheight}px !important;
    div{
      font-size: ${props => props.mobilefontsize}px !important;
    }
      button{
        font-size: ${props => props.mobilefontsize}px !important;
    }
  }
`;

export default ModalWrapper;
