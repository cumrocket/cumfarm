import { useEffect, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import useWeb3 from 'hooks/useWeb3'
import {
  getAddress,
  getMasterChefAddress,
  getCakeAddress,
  getBattlefieldAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getBunnyFactoryAddress,
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getPointCenterIfoAddress,
  getKdfnNFTsAddress,
  getSquireAddress,
  getTableAddress,
  getLegendAddress,
  getShillingAddress,
  getMilfNFTsAddress,
  getWbnbAddress,
  getCummiesV2LPAddress
} from 'utils/addressHelpers'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'
import ifo from 'config/abi/ifo.json'
import erc20 from 'config/abi/erc20.json'
import bunnyFactory from 'config/abi/bunnyFactory.json'
import pancakeRabbits from 'config/abi/pancakeRabbits.json'
import lottery from 'config/abi/lottery.json'
import lotteryTicket from 'config/abi/lotteryNft.json'
import masterChef from 'config/abi/masterchef.json'
import battlefield from 'config/abi/battlefield.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import profile from 'config/abi/pancakeProfile.json'
import wbnbAbi from 'config/abi/weth.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import kdfnNFTsAbi from 'config/abi/kdfnnfts.json'
import milfNftsAbi from 'config/abi/milfnfts.json'
import squireAbi from 'config/abi/squire.json'
import legendAbi from 'config/abi/legend.json'
import tableAbi from 'config/abi/table.json'
import knightAbi from 'config/abi/cake.json'
import shillingAbi from 'config/abi/shilling.json'

const useContract = (abi: AbiItem, address: string, contractOptions?: ContractOptions) => {
  const web3 = useWeb3()
  const [contract, setContract] = useState(new web3.eth.Contract(abi, address, contractOptions))

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address, contractOptions))
  }, [abi, address, contractOptions, web3])

  return contract
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const ifoAbi = (ifo as unknown) as AbiItem
  return useContract(ifoAbi, address)
}

export const useERC20 = (address: string) => {
  const erc20Abi = (erc20 as unknown) as AbiItem
  return useContract(erc20Abi, address)
}

export const useCake = () => {
  return useERC20(getCakeAddress())
}

export const useCummiesBNBLP = () => {
  return useERC20(getCummiesV2LPAddress())
}

export const useBunnyFactory = () => {
  const bunnyFactoryAbi = (bunnyFactory as unknown) as AbiItem
  return useContract(bunnyFactoryAbi, getBunnyFactoryAddress())
}

export const usePancakeRabbits = () => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem
  return useContract(pancakeRabbitsAbi, getPancakeRabbitsAddress())
}

export const useKnightsDefiNFTs = () => {
  const kdfnNFTAbi = (kdfnNFTsAbi as unknown) as AbiItem
  return useContract(kdfnNFTAbi, getKdfnNFTsAddress())
}
export const useMilfNFTs = () => {
  const milfNFTAbi = (milfNftsAbi as unknown) as AbiItem
  return useContract(milfNFTAbi, getMilfNFTsAddress())
}

export const useSquire = () => {
  const abi = (squireAbi as unknown) as AbiItem
  return useContract(abi, getSquireAddress())
}

export const useLegend = () => {
  const abi = (legendAbi as unknown) as AbiItem
  return useContract(abi, getLegendAddress())
}

export const useTable = () => {
  const abi = (tableAbi as unknown) as AbiItem
  return useContract(abi, getTableAddress())
}

export const useKnight = () => {
  const abi = (knightAbi as unknown) as AbiItem
  return useContract(abi, getCakeAddress())
}

export const useWbnb = () => {
  const abi = (wbnbAbi as unknown) as AbiItem
  return useContract(abi, getWbnbAddress())
}

export const useProfile = () => {
  const profileABIAbi = (profile as unknown) as AbiItem
  return useContract(profileABIAbi, getPancakeProfileAddress())
}

export const useLottery = () => {
  const abi = (lottery as unknown) as AbiItem
  return useContract(abi, getLotteryAddress())
}

export const useLotteryTicket = () => {
  const abi = (lotteryTicket as unknown) as AbiItem
  return useContract(abi, getLotteryTicketAddress())
}

export const useMasterchef = () => {
  const abi = (masterChef as unknown) as AbiItem
  return useContract(abi, getMasterChefAddress())
}

export const useBattlefield = () => {
  const abi = (battlefield as unknown) as AbiItem
  return useContract(abi, getBattlefieldAddress())
}

export const useShilling = () => {
  const abi = (shillingAbi as unknown) as AbiItem
  return useContract(abi, getShillingAddress())
}

export const useSousChef = (id) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const rawAbi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  const abi = (rawAbi as unknown) as AbiItem
  return useContract(abi, getAddress(config.contractAddress))
}

export const usePointCenterIfoContract = () => {
  const abi = (pointCenterIfo as unknown) as AbiItem
  return useContract(abi, getPointCenterIfoAddress())
}

export default useContract
