import { GoogleGenAI, GenerateContentResponse, Type, Chat } from "@google/genai";
import { CallFraudAnalysisResult, AiVoiceDetectionResult, SmsAnalysisResult } from "../types";

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
    systemInstruction: "You are a helpful and friendly AI assistant. Answer the user's questions accurately and conversationally on a wide range of topics.",
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
            text: `You are a world-class forensic art analyst specializing in detecting sophisticated AI-generated illustrations. Your reputation depends on your meticulous attention to detail and your ability to see past the superficial polish of an image. Your default assumption is that any digital illustration you see is a potential forgery.

**CRITICAL MANDATE: Begin your analysis from the background and periphery. Move inwards. The main subject is the last thing you should analyze in detail, as it is often used to distract from flaws elsewhere.**

**FORENSIC ANALYSIS PROTOCOL:**

**Step 1: Scrutinize for the 'Tell-Tale Trifecta' of AI Flaws.**
These three areas are the most common points of failure for AI, even in otherwise high-quality images. Find a significant flaw in any ONE of these, and the image is almost certainly AI-generated.

1.  **Muddled Background Details & Illogical Objects:**
    *   Examine objects on shelves, posters on walls, and furniture. Do they blend into each other nonsensically?
    *   Are art supplies (like brushes in a cup, paint jars) distinct objects, or are they a muddled, suggestive mess?
    *   Do background drawings or posters have a coherent and consistent style, or do they look like vague, dream-like imitations of art?
    *   This is the #1 giveaway. Be extremely critical here.

2.  **Inconsistent Line Art & Style Schisms:**
    *   Compare the line weight, quality, and style of the main character to the line art in the background. Is it consistent?
    *   **CRITICAL:** If a character is drawing something on a tablet/paper *within the image*, is the line quality of their drawing *identical* to the line quality of the character themselves? A human artist will almost always have a different style for the art-within-the-art. AI generators often fail this test, using the same line style for both, which is a massive red flag.

3.  **Uncanny Hands & Impossible Grips:**
    *   Go beyond just counting fingers. Look at the *structure* of the hand. Are the knuckles, palm, and wrist correctly proportioned?
    *   How is the hand interacting with objects? Is the pen/stylus held in a way that is physically plausible for applying pressure and drawing, or is it floating or awkwardly wedged between fingers?

**Step 2: General Artistic Cohesion Check.**
*   **Lighting:** Is the light source consistent across all elements? Are shadows cast logically?
*   **Anatomy:** Besides hands, are there any other subtle anatomical errors (e.g., strange ears, misplaced facial features)?

**Step 3: Final Verdict & Confidence Calibration.**
*   **The One-Strike Rule is Absolute:** A single, significant, unexplainable artifact from the 'Tell-Tale Trifecta' is definitive proof. Do not be swayed by the polish of the main character.
*   **Confidence Score Mandate:**
    *   If you find **one clear flaw** from the Trifecta, your confidence score for 'AI-generated' **must be 85% or higher**.
    *   If you find **multiple clear flaws**, your confidence score **must be 95% or higher**.
    *   An 'Authentic' classification is only possible if the image passes **every single check** flawlessly. 'Uncertain' should be used sparingly, only when the evidence is truly ambiguous.
*   **Explanation:** Your explanation must be a detailed forensic report, explicitly referencing which flaws you found and where, based on the protocol above.

Provide your output as a JSON object with 'classification', 'confidence' (0-100), and a detailed 'explanation'.`,
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

export const analyzeVoiceForAI = async (base64Audio: string, mimeType: string): Promise<AiVoiceDetectionResult> => {
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
            text: `Analyze this audio and determine if the voice is AI-generated or a human voice. Provide a classification ('AI-Generated Voice', 'Human Voice', or 'Uncertain'), a confidence score (0-100) for your classification, aiming for over 90% accuracy, and a brief explanation for your reasoning.`,
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

export const analyzeCallForFraud = async (base64Audio: string, mimeType: string): Promise<CallFraudAnalysisResult> => {
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
            text: `Perform a multi-faceted fraud analysis on this audio call.
            1. Voice Analysis: Determine if the voice is an AI-generated voice or a human voice.
            2. Keyword Detection: Transcribe the audio and identify any suspicious keywords like 'loan', 'OTP', 'password', 'account details', 'bank', 'card number', 'verify', 'urgent', 'prize'.
            3. Fraud Assessment: Based on the voice and keywords, provide a final assessment ('Fraudulent Call' or 'Safe Call'). Classify as 'Fraudulent Call' if the voice is AI-generated OR if suspicious keywords are present.
            4. Confidence Score: Provide a confidence score (0-100) for the overall assessment, aiming for over 90% accuracy.
            5. Explanation: Briefly explain your reasoning.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING },
            keywordsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            fraudAssessment: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          }
        }
      }
    });
    return cleanAndParseJson(response.text);
  } catch (error) {
    console.error("Error analyzing call:", error);
    return { classification: 'Uncertain', keywordsFound: [], fraudAssessment: 'Uncertain', confidence: 0, explanation: 'An error occurred during call analysis.' };
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

export const analyzeSmsForFraud = async (content: string, senderType: string): Promise<SmsAnalysisResult> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following SMS message for signs of fraud, considering its sender ID type.
            Sender ID Type: "${senderType}"
            Message: "${content}"
            
            Common fraud indicators include:
            - Urgency (e.g., "act now", "limited time")
            - Suspicious links (especially shortened URLs)
            - Requests for personal information (passwords, OTPs, bank details)
            - Unsolicited prize winnings or job offers
            - Threats or warnings (e.g., "account will be suspended")
            - Alphanumeric sender IDs for non-transactional messages.

            Based on these indicators, determine if this is likely a fraudulent message.
            Provide a classification ('safe' or 'fraud') and a brief, helpful explanation for the user.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        classification: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                    }
                }
            }
        });
        const result = cleanAndParseJson(response.text);
        if (result.classification !== 'safe' && result.classification !== 'fraud') {
            return { classification: 'safe', explanation: 'Received an unexpected classification. Defaulting to safe.' };
        }
        return result;
    } catch (error) {
        console.error("Error analyzing SMS:", error);
        return { classification: 'safe', explanation: 'An error occurred during analysis.' };
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
            contents: `You are a helpful voice assistant for CodeHustlers. Respond to the following user query concisely, as if you were speaking. Do not provide links or act like a search engine. Give a direct answer. Query: "${text}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error with voice assistant:", error);
        return "Sorry, I couldn't process that. Please try again.";
    }
};