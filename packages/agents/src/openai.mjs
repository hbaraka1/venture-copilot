const API_URL = "https://api.openai.com/v1/responses";

function outputText(response) {
  if (response.output_text) return response.output_text;
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  throw new Error("The model returned no output text");
}

export async function runResearchAgent({ apiKey, model, instructions, input, schema, schemaName }) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      reasoning: { effort: "medium" },
      tools: [{ type: "web_search" }],
      tool_choice: "auto",
      include: ["web_search_call.action.sources"],
      instructions,
      input,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${body.slice(0, 500)}`);
  }

  const payload = await response.json();
  return { data: JSON.parse(outputText(payload)), responseId: payload.id };
}
