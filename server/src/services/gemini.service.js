const { getModel, isGeminiConfigured } = require('../config/gemini');
const { getMockParseResult } = require('../utils/mockData');

/**
 * Parse a raw project description using Gemini 1.5 Pro.
 * Returns structured { title, extrapolated_BOM, required_skills }.
 */
const parseProjectDescription = async (rawText) => {
  if (!isGeminiConfigured()) {
    console.log('ℹ️  Using mock response (no Gemini API key)');
    return getMockParseResult(rawText);
  }

  const model = getModel();

  const prompt = `You are a hardware project planner and technical analyst. 
Analyze the following project description and extract:
1. A short project title (max 10 words)
2. A Bill of Materials (BOM) — every hardware component, sensor, module, display, connector, cable, or tool needed, with estimated quantities
3. Required human skills to complete the project

Project Description:
"""
${rawText}
"""

Return ONLY valid JSON in this exact format:
{
  "title": "Short project title",
  "extrapolated_BOM": [
    { "hardware_name": "Component Name", "quantity": 1, "notes": "Optional notes" }
  ],
  "required_skills": ["Skill 1", "Skill 2"]
}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini parsing error:', error.message);
    // Fallback to mock on error
    return getMockParseResult(rawText);
  }
};

module.exports = { parseProjectDescription };
