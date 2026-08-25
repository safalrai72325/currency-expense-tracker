const SUPPORTED_CURRENCIES = new Set([
  "USD", "EUR", "GBP", "INR", "NPR", "JPY", /* ...more */
]);

function validateExpenseInput(req, res, next) {
  const { title, amount, currency } = req.body;
  const errors = [];

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push("title is required and must be a non-empty string");
  }

  const numericAmount = Number(amount);
  if (amount === undefined || amount === null || amount === "" || Number.isNaN(numericAmount)) {
    errors.push("amount is required and must be a number");
  } else if (numericAmount <= 0) {
    errors.push("amount must be greater than 0");
  }

  if (typeof currency !== "string" || !SUPPORTED_CURRENCIES.has(currency.toUpperCase())) {
    errors.push("currency must be a supported currency code");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  req.body.amount = numericAmount; // normalize
  next();
}
function validateConvertQuery(req, res, next) {
  const { from, to, amount } = req.query;
  const errors = [];

  if (!from || typeof from !== "string" || !SUPPORTED_CURRENCIES.has(from.toUpperCase())) {
    errors.push("from must be a valid currency code");
  }
  if (!to || typeof to !== "string" || !SUPPORTED_CURRENCIES.has(to.toUpperCase())) {
    errors.push("to must be a valid currency code");
  }
  const numericAmount = Number(amount);
  if (amount === undefined || Number.isNaN(numericAmount) || numericAmount < 0) {
    errors.push("amount must be a non-negative number");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  next();
}
module.exports = { validateExpenseInput, validateConvertQuery, SUPPORTED_CURRENCIES };
