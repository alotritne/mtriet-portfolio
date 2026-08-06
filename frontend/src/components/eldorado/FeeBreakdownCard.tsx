import type { CalculatorResult, CalculatorSettings } from '../../types/calculator'
import { AnimatedValue } from './AnimatedValue'

export function FeeBreakdownCard({ result, settings }: { result: CalculatorResult; settings: CalculatorSettings }) {
  const fees: Array<[string, number]> = [['Sale fee', result.price * settings.saleFee / 100], ['Withdrawal fee', result.afterSale * settings.withdrawFee / 100], ['Withdrawal fixed', settings.withdrawFixedFee], ['Crypto fee', result.cryptoFee], ['Network fee', settings.networkFee], ['Bank fee', result.bankFee]]
  const total = fees.reduce((sum, [, value]) => sum + value, 0)
  return <section className="eld-card eld-fees"><div className="eld-card-heading"><div><span className="eld-eyebrow">Cost profile</span><h2>Fee breakdown</h2></div><strong className="eld-fee-total"><AnimatedValue value={total} formatter={value => `${value.toFixed(2)} USD`} /></strong></div><div className="eld-fee-list">{fees.map(([label, value]) => <div key={label}><span>{label}</span><b><AnimatedValue value={value} formatter={amount => amount.toFixed(2)} /></b><i><span style={{ width: `${Math.min((value / Math.max(result.price, 1)) * 100 * 3, 100)}%` }} /></i></div>)}</div></section>
}
