async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export function getExpenses() {
  return fetch("/expenses").then(handleResponse);
}

export function addExpense(expense) {
  return fetch("/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  }).then(handleResponse);
}

export function deleteExpense(id) {
  return fetch(`/expenses/${id}`, { method: "DELETE" }).then(handleResponse);
}

export function convertAmount(from, to, amount) {
  const params = new URLSearchParams({ from, to, amount });
  return fetch(`/convert?${params}`).then(handleResponse);
}
