export const DEFAULT_WEIGHTS = Object.freeze({
  thesisFit: 0.3,
  team: 0.15,
  market: 0.2,
  traction: 0.2,
  differentiation: 0.15,
});

export function weightedScore(scores, weights = DEFAULT_WEIGHTS) {
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(totalWeight - 1) > 0.0001) throw new Error("Score weights must sum to 1");
  return Number(
    Object.entries(weights)
      .reduce((total, [criterion, weight]) => total + Number(scores[criterion] ?? 0) * weight, 0)
      .toFixed(1),
  );
}

export function rankCompanies(companies) {
  return companies
    .map((company) => ({ ...company, totalScore: weightedScore(company.scores) }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((company, index) => ({ ...company, rank: index + 1 }));
}
