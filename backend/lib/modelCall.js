// lib/modelCall.js
import SYSTEM_PROMPT from "./SYSTEM_PROMPT.js";
import { getFormattedProductList } from "../services/ProductService.js";

// MODEL_PROVIDER can be 'openai', 'anthropic', or 'google'
const MODEL_PROVIDER = process.env.MODEL_PROVIDER || "google";
const API_KEY = process.env.MODEL_PROVIDER_API_KEY;

let productListCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 15 * 60 * 1000;

// Fetch Product List to Feed to the System Prompt for more Context Aware Responses
// Using the our Store's Product Catalog as a Base Prompt
// Later can be extended to show products links directly in the Chat UI
async function getModelResponse(userMessage) {
  try {
    // Get system prompt
    const systemPrompt = await getSystemPromptWithProducts();

    switch (MODEL_PROVIDER) {
      case "google":
        return await getGeminiResponse(systemPrompt, userMessage);
      case "openai":
        return await getOpenAIResponse(systemPrompt, userMessage);
      case "anthropic":
        return await getClaudeResponse(systemPrompt, userMessage);
      default:
        throw new Error(`Unsupported model provider: ${MODEL_PROVIDER}`);
    }
  } catch (error) {
    console.error("Error in model response:", error);
    return "I apologize, but I'm having trouble accessing our product information right now. How else can I assist you with your home decor needs?";
  }
}

async function getSystemPromptWithProducts() {
  const now = Date.now();
  if (!productListCache || now - lastFetchTime > CACHE_TTL) {
    try {
      productListCache = await getFormattedProductList();
      lastFetchTime = now;
    } catch (error) {
      console.error("Error fetching products, using demo list:", error);
    }
  }

  const basePrompt = SYSTEM_PROMPT();
  return basePrompt.replace("${productList}", productListCache || "");
}

// Gemini Route: Free API (using this for Demo Purposes)
async function getGeminiResponse(systemPrompt, userMessage) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\nUser question: ${userMessage}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Gemini API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
// OpenAI Route: Paid API
async function getOpenAIResponse(systemPrompt, userMessage) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
// Claude Route: Paid API
async function getClaudeResponse(systemPrompt, userMessage) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3.7-sonnet",
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Claude API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.content[0]?.text || "";
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
}

export { getModelResponse };
