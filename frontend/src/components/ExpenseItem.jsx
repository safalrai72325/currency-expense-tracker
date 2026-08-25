import { formatMoney } from "../format";

export default function ExpenseItem({ expense, conversion, homeCurrency, onDelete }) {
  const { title, amount, currency, date } = expense;
  const sameCurrency = currency === homeCurrency;

  return (
    <li className="expense-item">
      <div className="expense-main">
        <span className="expense-title">{title}</span>
        <span className="expense-date">
          {new Date(date).toLocaleDateString()}
        </span>
      </div>

      <div className="expense-amounts">
        <span className="expense-original">{formatMoney(amount, currency)}</span>
        {!sameCurrency && conversion && (
          <span className="expense-converted">
            {conversion.status === "loading" && "converting…"}
            {conversion.status === "error" && "conversion unavailable"}
            {conversion.status === "done" &&
              `≈ ${formatMoney(conversion.converted, homeCurrency)}`}
          </span>
        )}
      </div>

      <button
        className="delete-btn"
        onClick={() => onDelete(expense.id)}
        aria-label={`Delete ${title}`}
      >
        Delete
      </button>
    </li>
  );
}
