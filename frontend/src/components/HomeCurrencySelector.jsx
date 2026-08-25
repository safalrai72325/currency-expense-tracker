import { CURRENCIES } from "../currencies";

export default function HomeCurrencySelector({ value, onChange }) {
  return (
    <div className="home-currency-selector">
      <label htmlFor="home-currency">Home currency</label>
      <select
        id="home-currency"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
