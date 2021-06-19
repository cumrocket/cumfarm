import React from 'react'
import { Button, useWalletModal } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  background-color: #32325d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 6rem;

  &:hover {
    background-color: #32325d;
  }
`

const UnlockButton = (props) => {
  const TranslateString = useI18n()
  const { connect, reset } = useWallet()
  const { onPresentConnectModal } = useWalletModal(connect, reset)

  return (
    <StyledButton onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </StyledButton>
  )
}

export default UnlockButton
