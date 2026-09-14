const form = document.querySelector("#thesis-form");
const empty = document.querySelector("#empty-state");
const loading = document.querySelector("#loading-state");
const results = document.querySelector("#results");
const state = document.querySelector("#result-state");
const button = form.querySelector("button");

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character]);
const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

function render(data) {
  results.innerHTML = `<div class="summary"><span>AGENT SYNTHESIS</span><p>${escapeHtml(data.executiveSummary)}</p></div>` + data.companies.map((company) => `
    <article class="deal">
      <div class="deal-title"><span class="rank">${String(company.rank).padStart(2, "0")}</span><div><h3>${escapeHtml(company.name)}</h3><p class="meta">${escapeHtml(company.stage)} · ${escapeHtml(company.sector)} · ${escapeHtml(company.geography)}</p></div><span class="score">${company.totalScore}</span></div>
      <p class="one-liner">${escapeHtml(company.oneLiner)}</p><span class="recommendation">${escapeHtml(company.recommendation)} · ${Math.round(company.confidence * 100)}% confidence</span>
      <details><summary>WHY IT COULD WIN</summary>${list(company.strengths)}</details>
      <details><summary>RISKS & MISSING EVIDENCE</summary>${list(company.risks)}</details>
      <details><summary>FOUNDER QUESTIONS</summary>${list(company.openQuestions)}</details>
      <details class="sources"><summary>SOURCES (${company.sources.length})</summary>${company.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.publisher)} — ${escapeHtml(source.title)} ↗</a>`).join("")}</details>
    </article>`).join("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fields = Object.fromEntries(new FormData(form));
  const thesis = { ...fields, candidateCount: Number(fields.candidateCount), shortlistCount: Number(fields.shortlistCount) };
  empty.classList.add("hidden"); results.classList.add("hidden"); loading.classList.remove("hidden"); button.disabled = true; state.textContent = "RUNNING / 01";
  try {
    const response = await fetch("/api/screen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ thesis }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The workflow failed");
    render(data); loading.classList.add("hidden"); results.classList.remove("hidden"); state.textContent = `COMPLETE / ${String(data.companies.length).padStart(2, "0")}`;
  } catch (error) {
    loading.classList.add("hidden"); empty.classList.remove("hidden"); empty.querySelector("h2").textContent = "The research run stopped."; empty.querySelector("p").textContent = error.message; state.textContent = "ERROR / 00";
  } finally { button.disabled = false; }
});
