const express = require("express");
const { validateConvertQuery } = require("../middleware/validate");

const router = express.Router();

const FRANKFURTER_BASE = "https://api.frankfurter.app";
const REQUEST_TIMEOUT_MS = 5000;

class ConversionError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const rateCache = new Map();
const CACHE_TTL_MS = 60 * 1000;

async function fetchRate(from, to) {
  if (from === to) return 1;

  // cache check — "from" and "to" are in scope here because we're
  // still inside fetchRate's { } at this point
  const cacheKey = `${from}_${to}`;
  const cached = rateCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.rate;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(
      `${FRANKFURTER_BASE}/latest?from=${from}&to=${to}`,
      { signal: controller.signal }
    );
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ConversionError("Exchange rate service timed out.", 504);
    }
    throw new ConversionError("Could not reach the exchange rate service.", 502);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ConversionError(`Exchange rate service returned status ${response.status}.`, 502);
  }

  const data = await response.json();
  const rate = data?.rates?.[to];
  if (typeof rate !== "number") {
    throw new ConversionError(`Rate for ${from} -> ${to} is not available.`, 502);
  }

  // save to cache before returning
  rateCache.set(cacheKey, { rate, expiresAt: Date.now() + CACHE_TTL_MS });
  return rate;
}

router.get("/", validateConvertQuery, async (req, res) => {
  const from = req.query.from.toUpperCase();
  const to = req.query.to.toUpperCase();
  const amount = Number(req.query.amount);

  try {
    const rate = await fetchRate(from, to);
    const converted = Number((amount * rate).toFixed(2));
    res.json({ from, to, amount, rate, converted });
  } catch (err) {
    if (err instanceof ConversionError) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Unexpected server error." });
  }
});

module.exports = router;
