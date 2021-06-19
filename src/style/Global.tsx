import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap-libs/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'SharpSans-Bold';
    src: url('/fonts/SharpSans-Bold.woff');
  }

  @font-face {
    font-family: 'SharpSans-Semibold';
    src: url('/fonts/SharpSans-Semibold.woff');
  }

  * {
    font-family: 'Poppins', sans-serif;
  }

  body {
    background-color: #ffffff;
    background-image: url('/images/cumrocket-bg.jpg');
    background-repeat: no-repeat;
    background-size: contain;
    font-family: 'SharpSans-Bold', sans-serif;
    color: #32325D !important;

    img {
      height: auto;
      max-width: 100%;
    }
  }
  
  div.sc-TmcTc {
    display: none !important;
  }
  
  div.sc-jeGSBP {
    display: none !important;
  }
  
   .sc-gsTCUz  {
    color: #32325d;
  }

  .sc-bYEvPH {
    color: #5f7888;
    font-size: 12px;
  }
  
  .sc-bdfBwQ, .bEGajC {
    fill: #32325d !important;
  }
`

export default GlobalStyle
