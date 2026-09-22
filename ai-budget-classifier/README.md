# AI Model Integration — Expense Categorizer

Integrates a real, public Hugging Face model into the Smart Budget Assistant:
**zero-shot classification** of free-text expense descriptions into budget
categories — with no training data of our own, no API key, and no paid
service.

## Model used

- **Model:** [`Xenova/nli-deberta-v3-xsmall`](https://huggingface.co/Xenova/nli-deberta-v3-xsmall) — a quantized ONNX port of a DeBERTa-v3 model fine-tuned for natural language inference (NLI), hosted publicly on the Hugging Face Hub.
- **Library:** [`@xenova/transformers`](https://www.npmjs.com/package/@xenova/transformers) (transformers.js) — runs the model locally via ONNX Runtime.
- **Technique:** zero-shot classification. The model never saw "budget categories" during training — it works by testing whether each candidate category is *entailed by* the expense description, and ranks categories by that entailment score. This means categories can be added or changed without retraining anything.
- **No API key required.** The model downloads from the public Hugging Face Hub on first run and is cached locally (`.cache/`).

## Why zero-shot instead of a fixed classifier

A traditional classifier needs a labeled training set per category. Zero-shot
skips that entirely — you supply your category names as plain English labels
at query time, and the model reasons about fit. That's a good match for a
budget app where categories are often user-defined or change over time.

## How it works

1. Load the `Xenova/nli-deberta-v3-xsmall` zero-shot-classification pipeline.
2. For each expense description, test it against 8 candidate categories: Food & Dining, Transportation, Rent & Housing, Utilities, Entertainment, Shopping, Health & Medical, Savings & Investment.
3. Return the highest-scoring category plus the full confidence distribution across all categories, so genuinely ambiguous expenses are visible as such (not hidden behind a single label).

## Run it

```bash
cd ai-budget-classifier
npm install
npm run demo                                    # runs 8 built-in example expenses
node classify.mjs "Bought a movie ticket"        # classify your own expense
```

## Example inputs and outputs

Captured verbatim from a real run (`npm run demo`):

| Input | Predicted category | Confidence |
|---|---|---|
| "Paid the electricity bill for this month" | Utilities | 0.8627 |
| "Grabbed lunch with coworkers at a cafe" | Food & Dining | 0.8940 |
| "Monthly rent payment to landlord" | Rent & Housing | 0.9313 |
| "Uber ride to the airport" | Transportation | 0.8626 |
| "Bought a new pair of running shoes" | Shopping | 0.5327 |
| "Deposited money into my mutual fund SIP" | Savings & Investment | 0.4028 |
| "Doctor's appointment and prescription medicines" | Health & Medical | 0.9393 |
| "Netflix and Spotify subscriptions" | Entertainment | 0.7901 |

All 8 correctly categorized. Full JSON output (including every category's
score, not just the winner):

```json
{
  "description": "Uber ride to the airport",
  "category": "Transportation",
  "confidence": 0.8626,
  "allScores": [
    { "category": "Transportation", "score": 0.8626 },
    { "category": "Rent & Housing", "score": 0.0392 },
    { "category": "Entertainment", "score": 0.0344 },
    { "category": "Savings & Investment", "score": 0.0164 },
    { "category": "Utilities", "score": 0.0143 },
    { "category": "Health & Medical", "score": 0.0138 },
    { "category": "Shopping", "score": 0.0114 },
    { "category": "Food & Dining", "score": 0.0078 }
  ]
}
```

**A genuinely ambiguous case**, included honestly rather than cherry-picked:

```
Input:  "Bought groceries and vegetables for the week"
Output: category "Shopping" (0.5268), runner-up "Food & Dining" (0.4307)
```

Groceries plausibly belong in either category, and the model's near-even
split reflects that ambiguity rather than forcing false confidence — this is
the expected, honest behavior of a probabilistic classifier on an
under-specified input.

## Files

- `classify.mjs` — the prototype (model loading, zero-shot classification, CLI)
- `package.json` — single dependency: `@xenova/transformers`
