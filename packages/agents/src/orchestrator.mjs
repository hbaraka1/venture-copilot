import { runResearchAgent } from "./openai.mjs";
import { DISCOVERY_INSTRUCTIONS, SCREENING_INSTRUCTIONS, screeningPrompt, thesisPrompt } from "./prompts.mjs";
import { discoverySchema, screeningSchema } from "./schemas.mjs";
import { rankCompanies } from "./scoring.mjs";

export async function runSourcingWorkflow({ thesis, config, onEvent = () => {} }) {
  onEvent({ step: "discovery", status: "running", message: "Searching for thesis-matched companies" });
  const discovery = await runResearchAgent({
    ...config,
    instructions: DISCOVERY_INSTRUCTIONS,
    input: thesisPrompt(thesis),
    schema: discoverySchema,
    schemaName: "startup_discovery",
  });
  onEvent({ step: "discovery", status: "complete", message: `Found ${discovery.data.candidates.length} candidates` });

  onEvent({ step: "screening", status: "running", message: "Verifying evidence and applying the scorecard" });
  const screening = await runResearchAgent({
    ...config,
    instructions: SCREENING_INSTRUCTIONS,
    input: screeningPrompt(thesis, discovery.data),
    schema: screeningSchema,
    schemaName: "venture_screening",
  });
  onEvent({ step: "screening", status: "complete", message: "Shortlist ranked" });

  return {
    generatedAt: new Date().toISOString(),
    thesis,
    discoverySummary: discovery.data.searchSummary,
    executiveSummary: screening.data.executiveSummary,
    companies: rankCompanies(screening.data.companies),
    methodology: screening.data.methodology,
    limitations: screening.data.limitations,
    trace: { discoveryResponseId: discovery.responseId, screeningResponseId: screening.responseId },
  };
}
