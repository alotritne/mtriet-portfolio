export type CalculatorSettings = {
  saleFee: number
  withdrawFee: number
  withdrawFixedFee: number
  skrillCryptoFee: number
  networkFee: number
  skrillBankFee: number
  minimumBankFee: number
  p2pRate: number
}

export type CalculatorResult = {
  price: number
  afterSale: number
  afterWithdraw: number
  bankFee: number
  receiveBank: number
  receiveBankVND: number
  cryptoFee: number
  receiveUSDT: number
  receiveUSDTVND: number
  bankTotalFee: number
  cryptoTotalFee: number
  bankFeePercent: number
  cryptoFeePercent: number
}
