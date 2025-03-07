import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Tag, Flex, Heading, Image, Text } from '@pancakeswap-libs/uikit'
import { CommunityTag, CoreTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityBattlefield?: boolean
  battlefieldImage?: string
  tokenSymbol?: string
  burnPct?: number
  rewardPoolPct?: number
  externalFeePct?: number
  rewardRate?: number
  earnedValue?: BigNumber
  userArmyPercent?: BigNumber
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`

const StyledHeading = styled(Heading)`
  color: #32325d !important;
`
const StyledText = styled(Text)`
  color: #32325d !important;
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityBattlefield,
  battlefieldImage,
  tokenSymbol,
  burnPct,
  rewardPoolPct,
  externalFeePct,
  rewardRate,
  earnedValue,
  userArmyPercent,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Image src={`/images/battlefield/${battlefieldImage}.png`} alt={tokenSymbol} width={64} height={64} />
      <Flex flexDirection="column" alignItems="flex-end">
        <StyledHeading mb="0px">{lpLabel}</StyledHeading>
        <StyledText mb="0px">Rate: {rewardRate * 1200} / hr.</StyledText>
        <StyledText mb="0px">
          You Earn: {(rewardRate * 1200 * userArmyPercent.dividedBy(1e18).toNumber()).toFixed(2)} / hr.
        </StyledText>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
