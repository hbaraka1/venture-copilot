const source = {
  type: "object",
  additionalProperties: false,
  required: ["title", "url", "publisher", "publishedAt"],
  properties: {
    title: { type: "string" },
    url: { type: "string" },
    publisher: { type: "string" },
    publishedAt: { type: ["string", "null"] },
  },
};

export const discoverySchema = {
  type: "object",
  additionalProperties: false,
  required: ["searchSummary", "candidates"],
  properties: {
    searchSummary: { type: "string" },
    candidates: {
      type: "array",
      minItems: 3,
      maxItems: 15,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "website", "oneLiner", "sector", "stage", "geography", "signals", "sources"],
        properties: {
          name: { type: "string" },
          website: { type: ["string", "null"] },
          oneLiner: { type: "string" },
          sector: { type: "string" },
          stage: { type: "string" },
          geography: { type: "string" },
          signals: { type: "array", items: { type: "string" }, maxItems: 6 },
          sources: { type: "array", items: source, minItems: 1, maxItems: 6 },
        },
      },
    },
  },
};

const scores = {
  type: "object",
  additionalProperties: false,
  required: ["thesisFit", "team", "market", "traction", "differentiation"],
  properties: {
    thesisFit: { type: "number", minimum: 0, maximum: 10 },
    team: { type: "number", minimum: 0, maximum: 10 },
    market: { type: "number", minimum: 0, maximum: 10 },
    traction: { type: "number", minimum: 0, maximum: 10 },
    differentiation: { type: "number", minimum: 0, maximum: 10 },
  },
};

export const screeningSchema = {
  type: "object",
  additionalProperties: false,
  required: ["executiveSummary", "companies", "methodology", "limitations"],
  properties: {
    executiveSummary: { type: "string" },
    companies: {
      type: "array",
      minItems: 1,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "website", "oneLiner", "sector", "stage", "geography", "scores", "strengths", "risks", "openQuestions", "recommendation", "confidence", "sources"],
        properties: {
          name: { type: "string" },
          website: { type: ["string", "null"] },
          oneLiner: { type: "string" },
          sector: { type: "string" },
          stage: { type: "string" },
          geography: { type: "string" },
          scores,
          strengths: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
          risks: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
          openQuestions: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
          recommendation: { type: "string", enum: ["priority", "watch", "pass"] },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          sources: { type: "array", items: source, minItems: 1, maxItems: 8 },
        },
      },
    },
    methodology: { type: "string" },
    limitations: { type: "array", items: { type: "string" }, maxItems: 6 },
  },
};
