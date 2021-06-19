import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Heading, Text, Link, Flex } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import {
  useBattlefield,
  usePriceBnbBusd,
  usePriceCakeBusd,
  usePriceEthBusd,
  usePriceLegendBusd,
  usePriceTableBusd,
  usePriceSquireBusd,
  usePriceShillingBusd,
} from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchBattlefieldUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import BattlefieldCard, { BattlefieldWithStakedValue } from './components/BattlefieldCard/BattlefieldCard'
import { CummiesLPStakingCard } from './components/BattlefieldCard/CummiesLPStakingCard'
import Divider from './components/Divider'

const CollabLink = styled(Link)`
  color: #32325d;
  display: inline-block;
  font-size: 13px;
  text-align: center;
`

const CollabText = styled(Text)`
  font-size: 13px;
  text-align: center;
  margin: 0 auto;
`

const Battlefield: React.FC = () => {
  const { path } = useRouteMatch()
  const battlefieldLP = useBattlefield()
  const cakePrice = usePriceCakeBusd()
  const legendPrice = usePriceLegendBusd()
  const squirePrice = usePriceSquireBusd()
  const tablePrice = usePriceTableBusd()
  const shillingPrice = usePriceShillingBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const ethPriceUsd = usePriceEthBusd()
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchBattlefieldUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stackedOnly, setStackedOnly] = useState(false)

  const Action = styled.div`
    padding-top: 16px;
  `

  const StyledLink = styled(Link)`
    display: inline;
    color: ${({ theme }) => theme.colors.failure};
  `

  const FooterNav = styled.ul`
    display: flex;
    flex-direction: row;
  `

  const FooterNavItem = styled.div`
    padding: 1rem 0.8rem;
    font-size: 14px;
  `

  const FooterNavItemLink = styled.a`
    color: #e2659d;

    &:hover {
      color: #d4558e;
    }
  `

  const activeBattlefields = battlefieldLP.filter((battlefield) => battlefield.visible === true)

  // /!\ This function will be removed soon
  // This function compute the APY for each battlefield and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const battlefieldList = useCallback(
    (battlefieldToDisplay, removed: boolean) => {
      const cakePriceVsBNB = new BigNumber(
        battlefieldLP.find((battlefield) => battlefield.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0,
      )
      const battlefieldToDisplayWithAPY: BattlefieldWithStakedValue[] = battlefieldToDisplay.map((battlefield) => {
        if (!battlefield.tokenAmount || !battlefield.lpTotalInQuoteToken || !battlefield.lpTotalInQuoteToken) {
          return battlefield
        }
        const cakeRewardPerBlock = CAKE_PER_BLOCK.times(battlefield.poolWeight)
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        // cakePriceInQuote * cakeRewardPerYear / lpTotalInQuoteToken
        let apy = cakePriceVsBNB.times(cakeRewardPerYear).div(battlefield.lpTotalInQuoteToken)

        if (battlefield.quoteTokenSymbol === QuoteToken.BUSD || battlefield.quoteTokenSymbol === QuoteToken.UST) {
          apy = cakePriceVsBNB.times(cakeRewardPerYear).div(battlefield.lpTotalInQuoteToken).times(bnbPrice)
        } else if (battlefield.quoteTokenSymbol === QuoteToken.ETH) {
          apy = cakePrice.div(ethPriceUsd).times(cakeRewardPerYear).div(battlefield.lpTotalInQuoteToken)
        } else if (battlefield.quoteTokenSymbol === QuoteToken.CAKE) {
          apy = cakeRewardPerYear.div(battlefield.lpTotalInQuoteToken)
        } else if (battlefield.quoteTokenSymbol === QuoteToken.KNIGHT) {
          apy = cakeRewardPerYear.div(battlefield.lpTotalInQuoteToken)
        } else if (battlefield.dual) {
          const cakeApy =
            battlefield &&
            cakePriceVsBNB.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(battlefield.lpTotalInQuoteToken)
          const dualApy =
            battlefield.tokenPriceVsQuote &&
            new BigNumber(battlefield.tokenPriceVsQuote)
              .times(battlefield.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(battlefield.lpTotalInQuoteToken)

          apy = cakeApy && dualApy && cakeApy.plus(dualApy)
        }

        return { ...battlefield, apy }
      })
      return battlefieldToDisplayWithAPY.map((battlefield) => (
        <BattlefieldCard
          key={battlefield.pid}
          battlefield={battlefield}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          legendPrice={legendPrice}
          tablePrice={tablePrice}
          squirePrice={squirePrice}
          shillingPrice={shillingPrice}
          ethPrice={ethPriceUsd}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [
      battlefieldLP,
      bnbPrice,
      legendPrice,
      tablePrice,
      squirePrice,
      shillingPrice,
      ethPriceUsd,
      cakePrice,
      ethereum,
      account,
    ],
  )

  return (
    <Page>
      <Hero>
        <CummiesLPStakingCard />
      </Hero>

      <div>
        <FlexLayout>{battlefieldList(activeBattlefields, true)}</FlexLayout>
        <FlexLayout style={{ flexDirection: 'column', textAlign: 'center', margin: '0 auto', width: '100%' }}>
          <Flex style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
            <FooterNav className="footer-wrap">
              <FooterNavItem>
                <FooterNavItemLink className="sharp-bold footer-link" href="https://cumrocket.io/" target="_blank">
                  Website
                </FooterNavItemLink>
              </FooterNavItem>
              <FooterNavItem>
                <FooterNavItemLink className="sharp-bold footer-link" href="https://t.me/cumrocket" target="_blank">
                  Telegram
                </FooterNavItemLink>
              </FooterNavItem>
              <FooterNavItem>
                <FooterNavItemLink
                  className="sharp-bold footer-link"
                  href="https://discord.com/invite/cummies"
                  target="_blank"
                >
                  Discord
                </FooterNavItemLink>
              </FooterNavItem>
              <FooterNavItem>
                <FooterNavItemLink
                  className="sharp-bold footer-link"
                  href="https://twitter.com/CumRocketCrypto"
                  target="_blank"
                >
                  Twitter
                </FooterNavItemLink>
              </FooterNavItem>
              <FooterNavItem>
                <FooterNavItemLink
                  className="sharp-bold footer-link"
                  href="https://poocoin.app/tokens/0x27ae27110350b98d564b9a3eed31baebc82d878d"
                  target="_blank"
                >
                  Chart
                </FooterNavItemLink>
              </FooterNavItem>
            </FooterNav>
            <img className="footer-logo" alt="CumRocket" src="/images/battlefield/cumrocket.svg" />
          </Flex>
          <Flex style={{ margin: '1rem auto' }}>
            <CollabText>
              In collaboration with{' '}
              <CollabLink href="https://www.knightsdefi.com" target="_blank">
                Knights Defi
              </CollabLink>
            </CollabText>
          </Flex>
        </FlexLayout>
      </div>
    </Page>
  )
}

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  justify-content: center;
  padding: 48px 0;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
`

export default Battlefield
