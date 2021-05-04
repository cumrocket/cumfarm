import React from 'react'
import { Card, CardBody, Heading, Text, Button } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupplySquire, useBurnedBalance } from 'hooks/useTokenBalance'
import { getSquireAddress } from 'utils/addressHelpers'
import { usePriceSquireBusd } from 'state/hooks'
import CardValue from './CardValue'


const StyledCakeStats = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`
const CardBodyExtended = styled(CardBody)`
  width: 100%;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const SquireStats = () => {
  const totalSupply = useTotalSupplySquire()
  const burnedBalance = useBurnedBalance(getSquireAddress())
  const squireSupply = totalSupply ? getBalanceNumber(totalSupply) - getBalanceNumber(burnedBalance) : 0
  const squireMarketCap = usePriceSquireBusd().toNumber() * squireSupply 

  return (
    <StyledCakeStats>
      <CardBodyExtended>
        <Heading size="lg" mb="12px">
          SQUIRE Stats
        </Heading>
        <Button as="a" variant="secondary" mb="12px" href={`https://v1exchange.pancakeswap.finance/#/swap?outputCurrency=${getSquireAddress()}`} target="_blank">
            Buy Squire
        </Button>
        <Row>
          <Text fontSize="14px">Total SQUIRE Supply</Text>
          {squireSupply && <CardValue fontSize="14px" decimals={1} value={squireSupply} />}
        </Row>
        <Row>
          <Text fontSize="14px">Total SQUIRE Burned</Text>
          <CardValue fontSize="14px" decimals={1}value={getBalanceNumber(burnedBalance)} />
        </Row>
        <Row>
          <Text fontSize="14px">SQUIRE Market Cap</Text>
          <CardValue fontSize="14px" decimals={0} value={squireMarketCap} prefix='$'/>
        </Row>
        <Row>
          <Text fontSize="14px">{"\n"}</Text>
        </Row>
      </CardBodyExtended>
    </StyledCakeStats>
  )
}

export default SquireStats
