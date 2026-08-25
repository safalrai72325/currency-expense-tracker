let expenses = [];
let nextId = 1;

function getAll() {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function add({ title, amount, currency, date }) {
  const expense = {
    id: String(nextId++),
    title: title.trim(),
    amount,
    currency: currency.toUpperCase(),
    date: date || new Date().toISOString(),
  };
  expenses.push(expense);
  return expense;
}

function remove(id) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  return true;
}

module.exports = { getAll, add, remove };
