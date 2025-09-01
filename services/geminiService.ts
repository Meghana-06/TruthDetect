import { GoogleGenAI, GenerateContentResponse, Type, Chat } from "@google/genai";
import { VoiceAnalysisResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// A helper to safely parse JSON responses that might be wrapped in markdown
const cleanAndParseJson = (text: string) => {
  let cleanedText = text.trim();
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
  } else if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
  }
  return JSON.parse(cleanedText);
};


// Initialize a chat session for the chatbot
const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: "You are a friendly and professional support assistant for CodeHustlers, the team behind the TruthLens application. Your primary role is to help users with their questions about using TruthLens. If you cannot resolve a user's issue or they ask to speak with a human, provide them with the official support email: teamcodehustlers@gmail.com. Do not answer general knowledge questions; focus solely on assisting with the TruthLens app.",
  },
});

export const getChatbotResponse = async (message: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error with chatbot:", error);
        return "Sorry, I'm having trouble connecting. Please try again later.";
    }
};

export const analyzeImageForAI = async (base64Image: string, mimeType: string): Promise<any> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: "Perform a highly detailed and critical analysis of this image for any signs of AI generation. Scrutinize intrinsic features like texture inconsistencies, illogical details, unnatural noise patterns, and known AI model artifacts. Ignore ambient lighting conditions. Your analysis must be thorough. Provide a classification ('AI-generated', 'Authentic', or 'Uncertain'), a confidence score (0-100), and a comprehensive, step-by-step explanation of your reasoning.",
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          }
        }
      }
    });
    return cleanAndParseJson(response.text);
  } catch (error) {
    console.error("Error analyzing image:", error);
    return { classification: 'Uncertain', confidence: 0, explanation: 'An error occurred during analysis.' };
  }
};

export const analyzeVoiceForAI = async (base64Audio: string, mimeType: string): Promise<VoiceAnalysisResult> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: "Analyze the voice in this audio clip. Determine if it is an AI-generated voice or a human voice. Scrutinize for subtle artifacts, unnatural cadence, pitch inconsistencies, or lack of emotional depth typical of synthesized speech. Provide a classification ('AI-Generated Voice' or 'Human Voice'), a confidence score (0-100), and a brief explanation for your conclusion.",
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          }
        }
      }
    });
    return cleanAndParseJson(response.text);
  } catch (error) {
    console.error("Error analyzing voice:", error);
    return { classification: 'Uncertain', confidence: 0, explanation: 'An error occurred during voice analysis.' };
  }
};


export const analyzeArticleContent = async (content: string): Promise<any> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Perform a deep, critical analysis of the following article content. Break it down into its core claims. Meticulously fact-check each individual claim against multiple reliable, independent sources. For your findings, provide source attribution. Conclude with an overall misinformation risk level ('Low', 'Medium', 'High'), a credibility score (0-100), a list of relevant topic tags, and a concise, neutral summary of the content. Article content: "${content}"`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        riskLevel: { type: Type.STRING },
                        credibilityScore: { type: Type.INTEGER },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        summary: { type: Type.STRING },
                        claims: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    claim: { type: Type.STRING },
                                    verification: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return cleanAndParseJson(response.text);
    } catch (error) {
        console.error("Error analyzing article:", error);
        return { riskLevel: 'High', credibilityScore: 0, tags: [], summary: 'Error during analysis.', claims: [] };
    }
};

export const generateAwarenessTemplateText = async (prompt: string): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate content for an awareness infographic based on this topic: "${prompt}". Provide a catchy title, 3-4 key bullet points explaining why the content is misleading, and 1-2 safety tips or verified sources. Make it concise and easy to share.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                        tips: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return cleanAndParseJson(response.text);
    } catch (error) {
        console.error("Error generating template text:", error);
        return { title: 'Error', highlights: ['Could not generate content.'], tips: [] };
    }
};

export const getTrendingTopics = async (): Promise<{ topic: string; risk: string; score: number }[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "List the top 5 trending misinformation topics or narratives currently circulating online. For each topic, provide a short title, a risk level ('High', 'Medium', 'Low'), and a credibility score (0-100). Format each as: `Title - Risk: [level] - Credibility: [score]`",
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const topics = text.split('\n').map(line => {
            const match = line.match(/(?:\d+\.\s*)?(.*?)\s*-\s*Risk:\s*(.*?)\s*-\s*Credibility:\s*(\d+)/);
            if (match) {
                return {
                    topic: match[1].trim().replace(/^"|"$/g, ''),
                    risk: match[2].trim(),
                    score: parseInt(match[3], 10),
                };
            }
            return null;
        }).filter((item): item is { topic: string; risk: string; score: number } => item !== null);
        
        if(topics.length > 0) return topics.slice(0, 5);
        
        if(text) return [{ topic: "Could not parse trending topics.", risk: 'Medium', score: 50 }];

        return [];
    } catch (error) {
        console.error("Error fetching trending topics:", error);
        return [{ topic: 'Error fetching topics.', risk: 'High', score: 0 }];
    }
};

export const getVoiceAssistantResponse = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a helpful voice assistant for TruthLens. Respond to the following user query concisely, as if you were speaking. Do not provide links or act like a search engine. Give a direct answer. Query: "${text}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error with voice assistant:", error);
        return "Sorry, I couldn't process that. Please try again.";
    }
};