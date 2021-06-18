import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap-libs/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    background-image: url('./images/arch-light.svg');
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: contain;

    img {
      height: auto;
      max-width: 100%;
    }
  }

  div.sc-fbNXWD > * :hover {
    background: #F6F6F8 !important;
  }


  a.sc-hOqqkJ {
    display: none !important;
  }

  div.sc-euMpXR {
    display: none !important;
  }

  svg.sc-bdfBwQ {
    /*display: none !important;*/
  }

  div.sc-gsxnyZ {
    display: none !important;
  }
  
  div.jZkyxP {
    display: none !important;
  }
  
  div.fJmXFJ {
    display: none !important;
  }
  
  
`

export default GlobalStyle
