import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import useI18n from 'hooks/useI18n'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`

const NotFound = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <StyledNotFound>
        <img src="/images/logo.png" width="64px" alt="logo" />
        <Heading size="xxl">404</Heading>
        <Text mb="16px">{TranslateString(1122, 'Oops, knight not found.')}</Text>
        <Button as="a" href="/" size="sm">
          {TranslateString(1124, 'Back Home')}
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
