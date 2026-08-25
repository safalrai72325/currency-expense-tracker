const express = require("express");
const cors = require("cors");
const expensesRouter = require("./routes/expenses");
const convertRouter = require("./routes/convert");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.use("/expenses", expensesRouter);
app.use("/convert", convertRouter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Expense tracker API listening on http://localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
