# Scoutline — Agentic VC sourcing copilot

Scoutline converts a fund's investment thesis into a ranked, evidence-backed startup shortlist. A sourcing agent discovers current companies on the web; a screening agent verifies the evidence, challenges the opportunity, and scores each company; deterministic application code produces the final ranking.

![Status](https://img.shields.io/badge/status-MVP-d8ff3e?style=flat-square&labelColor=101812) ![Node](https://img.shields.io/badge/node-%E2%89%A522-5FA04E?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-101812?style=flat-square)

## What it does

- Accepts sector, stage, geography, cheque size, exclusions, and positive signals.
- Uses live web search to source thesis-matched startups.
- Runs a separate screening pass to verify evidence and identify missing data.
- Scores thesis fit, team, market, traction, and differentiation.
- Returns ranked companies with strengths, risks, founder questions, confidence, and direct sources.

## Quick start

Requirements: Node.js 22+ and an OpenAI API key.

```bash
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No package installation is required: the MVP uses Node's native HTTP server and `fetch`.

## Configure the model

The default is `gpt-5.5`, chosen for multi-step agentic web research. Override it without changing code:

```bash
OPENAI_MODEL=your_available_model npm run dev
```

The implementation uses the OpenAI Responses API with the hosted `web_search` tool and strict JSON-schema output. See the official guides for [agentic web search](https://developers.openai.com/api/docs/guides/tools-web-search), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), and [agent patterns](https://developers.openai.com/api/docs/guides/agents/quickstart).

## Scorecard

| Criterion | Weight |
|---|---:|
| Thesis fit | 30% |
| Market | 20% |
| Traction | 20% |
| Team | 15% |
| Differentiation | 15% |

Change the rubric in `packages/agents/src/scoring.mjs`. Model-generated criterion scores are converted into a deterministic weighted total.

## Commands

```bash
npm run dev    # Start the app with .env loaded
npm run check  # Parse-check application files
npm test       # Run deterministic unit tests
```

## Repository structure

```text
apps/
  api/         HTTP API and web server
  web/         Browser interface
packages/
  agents/      Agent prompts, schemas, orchestration, scoring
  shared/      Runtime configuration
tests/         Unit tests
docs/          Architecture and roadmap
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the workflow and production roadmap.

## Responsible use

This tool accelerates research; it does not perform investment advice or final diligence. Web information can be stale, incomplete, or wrong. Analysts should open the cited sources, validate founder and traction claims, and retain final decision authority.

## License

MIT © 2026 Hassan Baraka
