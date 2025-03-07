import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { useBattlefieldHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import CompoundAction from './CompoundAction'
import HarvestButton from './HarvestButton'

interface BattlefieldCardActionsProps {
  earnings?: BigNumber
  pid?: number
  earnedValue?: BigNumber
}

const StyledText = styled(Text)`
  color: white;
  font-size: 14px;
  font-weight: 600;
`

const HarvestAction: React.FC<BattlefieldCardActionsProps> = ({ earnings, pid, earnedValue }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useBattlefieldHarvest(pid)

  let precision = 0
  const rawEarningsBalance = getBalanceNumber(earnings)
  if (rawEarningsBalance < 1000 && rawEarningsBalance >= 100) {
    precision = 1
  }
  if (rawEarningsBalance < 100 && rawEarningsBalance >= 1) {
    precision = 2
  }
  if (rawEarningsBalance < 1 && rawEarningsBalance >= 0.01) {
    precision = 3
  }
  if (rawEarningsBalance < 0.01 && rawEarningsBalance >= 0.001) {
    precision = 4
  }
  if (rawEarningsBalance < 0.001 && rawEarningsBalance >= 0) {
    precision = 5
  }
  if (rawEarningsBalance === 0) {
    precision = 0
  }

  const displayBalance = new BigNumber(rawEarningsBalance.toFixed(precision)).toNumber()
  let newDisplayBalance = '0'
  if (displayBalance > 0.001) {
    newDisplayBalance = displayBalance.toLocaleString()
  } else {
    newDisplayBalance = displayBalance.toFixed(precision)
  }
  const formattedEarnedValue = getBalanceNumber(earnedValue).toLocaleString()

  return (
    <Heading>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{newDisplayBalance}</Heading>
        <HarvestButton
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          <StyledText fontSize="14px" color="#ffffff" fontWeight="600">
            Harvest
          </StyledText>
        </HarvestButton>
      </Flex>
    </Heading>
  )
}

export default HarvestAction
