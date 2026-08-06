import type { CalculatorResult } from '../../types/calculator'
import { formatVND } from '../../utils/calculator'
import { AnimatedValue } from './AnimatedValue'

export function HeroResultCard({ result }: { result: CalculatorResult }) {
  const bankWins = result.receiveBank > result.receiveUSDT
  const saved = Math.abs(result.receiveBank - result.receiveUSDT)
  const savedVnd = Math.abs(result.receiveBankVND - result.receiveUSDTVND)
  const bestFee = bankWins ? result.bankTotalFee : result.cryptoTotalFee
  const savePercent = result.price ? saved / result.price * 100 : 0
  return <section className={`eld-result-card ${bankWins ? 'is-bank' : 'is-crypto'}`}>
    <div><span className="eld-eyebrow">You receive</span><strong><AnimatedValue value={bankWins ? result.receiveBank : result.receiveUSDT} formatter={value => `${value.toFixed(2)} ${bankWins ? 'USD' : 'USDT'}`} /></strong><span className="eld-result-vnd">≈ <AnimatedValue value={bankWins ? result.receiveBankVND : result.receiveUSDTVND} formatter={formatVND} /></span></div>
    <div className="eld-result-route"><span className="eld-badge">BEST ROUTE</span><b>{bankWins ? 'Skrill Bank' : 'USDT ERC20'}</b><span className="eld-badge">SAVE {savePercent.toFixed(2)}%</span><span className="eld-badge">LOWEST FEE · {bestFee.toFixed(2)} USD</span></div>
    <div className="eld-result-saved"><span>Saved</span><strong><AnimatedValue value={saved} formatter={value => `${value.toFixed(2)} USD`} /></strong><b><AnimatedValue value={savedVnd} formatter={formatVND} /></b></div>
  </section>
}
