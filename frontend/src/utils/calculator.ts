import type { CalculatorResult, CalculatorSettings } from '../types/calculator'

export const defaultSettings: CalculatorSettings = {
  saleFee: 5, withdrawFee: 5, withdrawFixedFee: 1, skrillCryptoFee: 2,
  networkFee: 0.11, skrillBankFee: 2.8, minimumBankFee: 4.05, p2pRate: 26000,
}

export function calculateEldorado(price: number, settings: CalculatorSettings): CalculatorResult {
  const afterSale = price * (1 - settings.saleFee / 100)
  const afterWithdraw = (afterSale * (1 - settings.withdrawFee / 100)) - settings.withdrawFixedFee
  const bankFee = Math.max(settings.minimumBankFee, afterWithdraw * settings.skrillBankFee / 100)
  const receiveBank = afterWithdraw - bankFee
  const cryptoFee = afterWithdraw * settings.skrillCryptoFee / 100
  const receiveUSDT = afterWithdraw - cryptoFee - settings.networkFee
  return {
    price, afterSale, afterWithdraw, bankFee, receiveBank,
    receiveBankVND: receiveBank * settings.p2pRate, cryptoFee, receiveUSDT,
    receiveUSDTVND: receiveUSDT * settings.p2pRate,
    bankTotalFee: price - receiveBank, cryptoTotalFee: price - receiveUSDT,
    bankFeePercent: price ? (price - receiveBank) / price * 100 : 0,
    cryptoFeePercent: price ? (price - receiveUSDT) / price * 100 : 0,
  }
}

export const formatUSD = (value: number) => `${value.toFixed(2)} USD`
export const formatVND = (value: number) => `${Math.round(value).toLocaleString('en-US')} VND`
