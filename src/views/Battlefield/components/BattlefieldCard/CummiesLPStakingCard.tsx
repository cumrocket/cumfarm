import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Text, Button, Heading } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import useWeb3 from 'hooks/useWeb3'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import useRefresh from 'hooks/useRefresh'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getBalanceNumber } from 'utils/formatBalance'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import UnlockButton from 'components/UnlockButton'
import { useBattlefieldShillingWithdraw } from 'hooks/useUnstake'
import { useBattlefieldApprove } from 'hooks/useApprove'
import { useShillingBnbHarvest } from 'hooks/useHarvest'
import { getBattlefieldContract, getShillingContract } from 'utils/contractHelpers'
import { getCakeAddress } from 'utils/addressHelpers'
import { usePriceShillingBusd, usePriceBnbBusd, useBattlefieldUser } from 'state/hooks'
import StakeAction from './StakeAction'

type State = {
  holdings: number
  bfStaking: number
}

const StyledButton = styled(Button)`
  background-color: #32325d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 6rem;

  &:hover {
    background-color: #32325d;
  }
`

const StyledLinkButton = styled(Button)`
  background-color: transparent;
  margin-top: 1.5rem;
  width: 100%;
  border: 0;
  color: #32325d;
  display: block;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`

const Wrapper = styled.div`
  margin-top: 24px;
  color: #32325d;
`

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(-45deg, #ff738e, #e4536f 20%, #a34054 40%, #b7eaff 60%, #92cee7 80%, #5dc4d9 100%);
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(8px);
  position: absolute;
  display: none;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div`
  align-self: baseline;
  background: white;
  border-radius: 32px;
  box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px, rgb(0 0 0 / 4%) 0px 10px 10px -5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`
const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

const StyledHeading1 = styled(Heading)`
  color: #32325d;
  font-size: 32px;
  text-align: left;
  max-width: 300px;
  background: linear-gradient(78.25deg, #7000e9, #ff00c5 20.93%, #ff0076 46.94%, #005ce3 92.49%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const CummiesLPStakingCard = () => {
  const [requestedApproval, setRequestedApproval] = useState(false)

  const { allowance, tokenBalance, stakedBalance } = useBattlefieldUser(0)

  const shillingBFRewardsPid = 0 // Change to Battlefield PID for Shilling Rewards after launch.
  const { fastRefresh, slowRefresh } = useRefresh()
  const { userArmyStrength, userArmyPercent } = useBattlefieldUser(0)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const web3 = useWeb3()
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const [state, setState] = useState<State>({
    holdings: 0,
    bfStaking: 0,
  })

  useEffect(() => {
    console.log('clean up')
  }, [])

  useEffect(() => {
    const fetchShillingDetails = async () => {
      if (account) {
        let holdings = 0
        let bfStaking = 0
        const bfContract = getBattlefieldContract()
        const shillContract = getShillingContract()
        const shillBFRewardsPid = 0 // Change to Battlefield PID for Shilling Rewards after launch.

        bfStaking = await bfContract.methods.userHoldings(account, shillBFRewardsPid).call()
        holdings = await shillContract.methods.balanceOf(account).call()

        // get BNB Claim date

        setState((prevState) => ({
          ...prevState,
          holdings,
          bfStaking,
        }))
      }
    }
    fetchShillingDetails()
  }, [slowRefresh, account, web3])

  const { onApprove } = useBattlefieldApprove()

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName="CUMMIES-BNB LP"
        pid={0}
        addLiquidityUrl="https://exchange.pancakeswap.finance//#/add/0x27Ae27110350B98d564b9A3eeD31bAeBc82d878d/BNB"
      />
    ) : (
      <StyledButton mt="8px" disabled={requestedApproval} onClick={handleApprove}>
        Approve Contract
      </StyledButton>
    )
  }

  if (account) {
    return (
      <FCard>
        <StyledCardAccent />
        <StyledHeading1 mb="12px">Stake CUMMIES-BNB V2 LP to earn CUMMIES!</StyledHeading1>

        <Divider />
        {renderApprovalOrStakeButton()}
        <Divider />

        <Heading mb="8px">Your pool share percentage: {(getBalanceNumber(userArmyPercent) * 100).toFixed(4)}%</Heading>
        <StyledLinkButton
          as="a"
          href="https://exchange.pancakeswap.finance//#/add/0x27Ae27110350B98d564b9A3eeD31bAeBc82d878d/BNB"
          target="_blank"
        >
          Add Liquidity for CUMMIES-BNB
        </StyledLinkButton>
      </FCard>
    )
  }
  /*  if(!shillingLaunched){
  return (
  <FCard>
      <StyledCardAccent />
      <Heading size='xl' mb="12px">SHILLING Token Launch</Heading>
      <Divider />
      <Heading size='lg' mb="12px">{formattedShillingLaunchDate}</Heading>
      <Heading mb="12px">{timeToLaunch.days} Days {timeToLaunch.hours} Hours {timeToLaunch.minutes} Minutes</Heading>
      <Button as="a" variant="secondary" href="https://docs.knightsdefi.com/shilling" target="_blank">
            Read More
      </Button>
  </FCard>
  )
  } */

  return (
    <FCard>
      <StyledCardAccent />
      <StyledHeading1 mb="24px" className="sharp-bold">
        Stake CUMMIES-BNB V2 LP to earn CUMMIES!
      </StyledHeading1>

      <UnlockButton />
    </FCard>
  )
}

export default CummiesLPStakingCard
