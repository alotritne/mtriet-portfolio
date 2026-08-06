export const formatPercent = (value: number) => `${value.toFixed(2)}%`
export const formatSignedUSD = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)} USD`
export const formatSignedVND = (value: number) => `${value >= 0 ? '+' : ''}${Math.round(value).toLocaleString('en-US')} VND`
