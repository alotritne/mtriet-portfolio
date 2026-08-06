import type { CalculatorSettings } from '../../types/calculator'

type Props = { settings: CalculatorSettings; onChange: (key: keyof CalculatorSettings, value: number) => void; onReset: () => void }
const fields: Array<[keyof CalculatorSettings, string, string]> = [
  ['saleFee', 'Sale fee', '%'], ['withdrawFee', 'Withdraw fee', '%'], ['withdrawFixedFee', 'Withdraw fixed fee', 'USD'],
  ['skrillCryptoFee', 'Skrill Crypto fee', '%'], ['networkFee', 'Network fee', 'USD'], ['skrillBankFee', 'Skrill Bank fee', '%'],
  ['minimumBankFee', 'Minimum Bank fee', 'USD'], ['p2pRate', 'P2P rate', 'VND'],
]
export function SettingsCard({ settings, onChange, onReset }: Props) {
  return <section className="eld-card eld-settings"><div className="eld-card-heading"><div><span className="eld-eyebrow">Configuration</span><h2>Settings</h2></div><button className="eld-quiet-button" onClick={onReset}>Reset</button></div><div className="eld-settings-grid">{fields.map(([key, label, unit]) => <label key={key}><span>{label}</span><div><input type="number" step="any" min="0" value={settings[key]} onChange={event => onChange(key, Number(event.target.value))} /><small>{unit}</small></div></label>)}</div></section>
}
