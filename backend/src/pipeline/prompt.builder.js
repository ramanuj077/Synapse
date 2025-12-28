class PromptBuilder {
  build(code, adapter, detectedSmells, refactorType) {

    const smellSection = detectedSmells.length > 0
      ? `Detected Issues (Fix these): \n- ${detectedSmells.join('\n- ')}`
      : "Focus on general best practices and code health.";

    const constraintSection = adapter.constraints.length > 0
      ? `Constraints (DO NOT COMPROMISE): \n- ${adapter.constraints.join('\n- ')}`
      : "";

    return `
You are an expert ${adapter.name} engineer specializing in ${refactorType || "Code Cleanup"}.

Refactoring Goal:
1. Fix the detected code smells listed below.
2. Adhere strictly to the Style Guide.
3. Improve maintainability, security, and performance.

Style Guide:
${adapter.styleGuide}

${smellSection}

${constraintSection}

CRITICAL INSTRUCTIONS:
- Functionality must remain EXACTLY the same.
- Do NOT add comments requesting human intervention. Fix it yourself.
- Explain your changes clearly in the "explanation" field.

Input Code:
\`\`\`${adapter.name.toLowerCase()}
${code}
\`\`\`

Return ONLY raw strict JSON with this schema (no markdown formatting):
{
  "layout": "refactor_v1",
  "smell_detected": "${detectedSmells[0] || "Code Improvement"}", 
  "refactored_code": "COMPLETELY REFACTORED CODE STRING HERE",
  "explanation": "Markdown string explaining changes...",
  "metrics": {
    "complexity_before": "number (Cyclomatic complexity)",
    "complexity_after": "number",
    "complexity_reduction": "High/Medium/Low",
    "time_complexity_before": "string (e.g. O(n))",
    "time_complexity_after": "string (e.g. O(1))",
    "risk_score": "number (0-100 probability of breaking changes)",
    "lines_saved": "number",
    "security_level": "Safe"
  },
  "refactorType": "${refactorType}",
  "analysis_type": "single_file",
  "safety_status": "Safe"
}
`;
  }
}

module.exports = new PromptBuilder();
