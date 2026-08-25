import { useEffect, useState, useMemo } from "react";
import { getExpenses, addExpense, deleteExpense, convertAmount } from "./api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import HomeCurrencySelector from "./components/HomeCurrencySelector";
import TotalDisplay from "./components/TotalDisplay";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [homeCurrency, setHomeCurrency] = useState("USD");
  const [conversions, setConversions] = useState({});

  useEffect(() => {
    getExpenses().then(setExpenses);
  }, []);

  useEffect(() => {
    const toConvert = expenses.filter((e) => e.currency !== homeCurrency);

    toConvert.forEach(async (expense) => {
      setConversions((prev) => ({ ...prev, [expense.id]: { status: "loading" } }));
      try {
        const result = await convertAmount(expense.currency, homeCurrency, expense.amount);
        setConversions((prev) => ({
          ...prev,
          [expense.id]: { status: "done", converted: result.converted },
        }));
      } catch (err) {
        setConversions((prev) => ({
          ...prev,
          [expense.id]: { status: "error", error: err.message },
        }));
      }
    });
  }, [expenses, homeCurrency]);

  async function handleAdd(expense) {
    const created = await addExpense(expense);
    setExpenses((prev) => [created, ...prev]);
  }

  async function handleDelete(id) {
    const previous = expenses;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteExpense(id);
    } catch (err) {
      setExpenses(previous);
    }
  }

  const { total, hasErrors, hasLoading } = useMemo(() => {
    let sum = 0, anyError = false, anyLoading = false;

    for (const expense of expenses) {
      if (expense.currency === homeCurrency) {
        sum += expense.amount;
        continue;
      }
      const c = conversions[expense.id];
      if (!c || c.status === "loading") anyLoading = true;
      else if (c.status === "error") anyError = true;
      else if (c.status === "done") sum += c.converted;
    }

    return { total: Number(sum.toFixed(2)), hasErrors: anyError, hasLoading: anyLoading };
  }, [expenses, conversions, homeCurrency]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Currency &amp; Expense Snapshot</h1>
        <HomeCurrencySelector value={homeCurrency} onChange={setHomeCurrency} />
      </header>

      <ExpenseForm onAdd={handleAdd} />

      <section className="expenses-section">
        <div className="expenses-section-header">
          <h2>Expenses</h2>
          <TotalDisplay
            total={total}
            homeCurrency={homeCurrency}
            hasErrors={hasErrors}
            hasLoading={hasLoading}
          />
        </div>

        <ExpenseList
          expenses={expenses}
          conversions={conversions}
          homeCurrency={homeCurrency}
          onDelete={handleDelete}
        />
      </section>
    </div>
  );
}
