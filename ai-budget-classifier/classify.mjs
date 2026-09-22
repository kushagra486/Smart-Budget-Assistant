// Smart Budget Assistant — AI model integration prototype
//
// Integrates a public Hugging Face zero-shot classification model
// (Xenova/nli-deberta-v3-xsmall, a quantized ONNX port of a
// DeBERTa-v3 model fine-tuned on multi-genre NLI) via transformers.js.
//
// Given a free-text expense description, the model classifies it into
// one of a fixed set of budget categories WITHOUT any training data of
// our own — zero-shot classification works by testing the entailment
// between the input text and each candidate label. No API key, no paid
// service: the model downloads once from the public Hugging Face Hub
// and is cached locally.

import { pipeline } from "@xenova/transformers";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Rent & Housing",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health & Medical",
  "Savings & Investment",
];

async function classifyExpense(classifier, description) {
  const result = await classifier(description, CATEGORIES);
  return {
    description,
    category: result.labels[0],
    confidence: Number(result.scores[0].toFixed(4)),
    allScores: result.labels.map((label, i) => ({
      category: label,
      score: Number(result.scores[i].toFixed(4)),
    })),
  };
}

const DEMO_EXPENSES = [
  "Paid the electricity bill for this month",
  "Grabbed lunch with coworkers at a cafe",
  "Monthly rent payment to landlord",
  "Uber ride to the airport",
  "Bought a new pair of running shoes",
  "Deposited money into my mutual fund SIP",
  "Doctor's appointment and prescription medicines",
  "Netflix and Spotify subscriptions",
];

async function main() {
  console.log("Loading model: Xenova/nli-deberta-v3-xsmall (public, no API key)...\n");
  const classifier = await pipeline("zero-shot-classification", "Xenova/nli-deberta-v3-xsmall");

  const isDemo = process.argv.includes("--demo");
  const cliInput = process.argv.slice(2).filter((a) => !a.startsWith("--")).join(" ");
  const expenses = isDemo || !cliInput ? DEMO_EXPENSES : [cliInput];

  for (const description of expenses) {
    const result = await classifyExpense(classifier, description);
    console.log(JSON.stringify(result, null, 2));
    console.log("---");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
