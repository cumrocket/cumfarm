import React from 'react'
import { Button, useWalletModal, Login } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

interface Props {
  account?: string
  login: Login
  logout: () => void
}

const StyledButton = styled(Button)`
  padding: 1.2rem 1.8rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
`

const StyledLoggedInButton = styled(Button)`
  padding: 1.2rem 1.6rem;
  border-radius: 3rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  background: white;
  color: #32325d;
  font-weight: 400;
  font-size: 14px;
`

const Svg = styled.svg`
  width: 16px;
  height: 16px;
  margin-right: 10px;
`

const UserBlock: React.FC<Props> = ({ account, login, logout }) => {
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account)
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  return (
    <div>
      {account ? (
        <StyledLoggedInButton
          scale="sm"
          onClick={() => {
            onPresentAccountModal()
          }}
        >
          <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </Svg>
          {accountEllipsis}
        </StyledLoggedInButton>
      ) : (
        <StyledButton
          className="btn-primary"
          scale="sm"
          onClick={() => {
            onPresentConnectModal()
          }}
        >
          Unlock Wallet
        </StyledButton>
      )}
    </div>
  )
}

export default React.memo(UserBlock, (prevProps, nextProps) => prevProps.account === nextProps.account)
