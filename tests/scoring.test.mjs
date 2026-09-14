import test from "node:test";
import assert from "node:assert/strict";
import { rankCompanies, weightedScore } from "../packages/agents/src/scoring.mjs";

test("weightedScore applies the default IC rubric", () => {
  assert.equal(weightedScore({ thesisFit: 10, team: 8, market: 7, traction: 6, differentiation: 9 }), 8.2);
});

test("rankCompanies sorts descending and assigns ranks", () => {
  const companies = [
    { name: "B", scores: { thesisFit: 5, team: 5, market: 5, traction: 5, differentiation: 5 } },
    { name: "A", scores: { thesisFit: 9, team: 9, market: 9, traction: 9, differentiation: 9 } },
  ];
  const ranked = rankCompanies(companies);
  assert.deepEqual(ranked.map(({ name, rank }) => ({ name, rank })), [{ name: "A", rank: 1 }, { name: "B", rank: 2 }]);
});

test("weightedScore rejects invalid weights", () => {
  assert.throws(() => weightedScore({}, { thesisFit: 0.5 }), /sum to 1/);
});
