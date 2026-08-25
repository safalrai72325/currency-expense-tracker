const express = require("express");
const store = require("../data/store");
const { validateExpenseInput } = require("../middleware/validate");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(store.getAll());
});

router.post("/", validateExpenseInput, (req, res) => {
  const { title, amount, currency, date } = req.body;
  const expense = store.add({ title, amount, currency, date });
  res.status(201).json(expense);
});

router.delete("/:id", (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: `Expense with id ${req.params.id} not found` });
  }
  res.status(204).send();
});

module.exports = router;
