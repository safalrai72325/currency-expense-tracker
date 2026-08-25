import { formatMoney } from "../format";

export default function TotalDisplay({ total, homeCurrency, hasErrors, hasLoading }) {
  return (
    <div className="total-display">
      <span className="total-label">Total ({homeCurrency})</span>
      <span className="total-value">
        {hasLoading ? "calculating…" : formatMoney(total, homeCurrency)}
      </span>
      {hasErrors && (
        <span className="total-warning">
          Some expenses couldn't be converted and are excluded from this total.
        </span>
      )}
    </div>
  );
}
