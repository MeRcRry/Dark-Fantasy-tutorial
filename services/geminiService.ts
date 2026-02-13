
import { GoogleGenAI, Type } from "@google/genai";
import { SkillType, Tutorial } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateTutorial(skillType: SkillType, topic: string): Promise<Tutorial> {
  const prompt = `
    You are a dark fantasy chronicler and mentor.
    Create a tutorial for the skill: ${skillType}.
    The specific topic is: ${topic}.
    
    The tone must be gothic, mysterious, and helpful. 
    Use medieval terminology (e.g., 'scripts' as 'incantations', 'variables' as 'reagents', 'teams' as 'legions', 'presentations' as 'enchantments').
    
    Structure the tutorial into:
    1. A thematic title.
    2. A lore-rich explanation of the concept.
    3. Three specific "Quest Tasks" for the user to complete.
    
    Format the response as JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['Novice', 'Adept', 'Master'] },
          tasks: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['title', 'content', 'difficulty', 'tasks']
      }
    }
  });

  return JSON.parse(response.text.trim()) as Tutorial;
}
