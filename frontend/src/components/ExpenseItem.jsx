export default function ExpenseItem({ expense, onDelete }) {
  return (
    <li>
      {expense.title} — {expense.amount} {expense.currency}
      <button onClick={() => onDelete(expense.id)}>Delete</button>
    </li>
  );
}
