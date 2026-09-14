export function getConfig(env = process.env) {
  return {
    apiKey: env.OPENAI_API_KEY ?? "",
    model: env.OPENAI_MODEL ?? "gpt-5.5",
    port: Number(env.PORT ?? 3000),
  };
}

export function assertConfig(config) {
  if (!config.apiKey) {
    throw new Error("OPENAI_API_KEY is required. Copy .env.example to .env and add your key.");
  }
}
