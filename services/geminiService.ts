
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionType, Difficulty, Topic, GeneratedQuestion } from "../types";

export class EconomicsAIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateQuestions(
    topic: Topic,
    type: QuestionType,
    difficulty: Difficulty,
    count: number
  ): Promise<GeneratedQuestion[]> {
    const prompt = `You are a world-class HKDSE Economics Examination Setter and Senior Marker.
Generate ${count} high-quality exam questions following the latest HKEAA assessment guidelines.

CRITICAL DIVERSITY & AUTHENTICITY RULES:
1. TERMINOLOGY: Strictly use HKDSE official terms (e.g., 'Ceteris paribus', 'Marginal Benefit', 'Deadweight Loss', 'Externalities', 'Real vs Nominal GDP', 'Law of Diminishing Marginal Returns').
2. QUESTION VARIETY (SUB-STYLES):
   - For MCQs: Include a mix of Conceptual, Calculation-based, Diagram-based interpretation, and Logical deduction.
   - For SQs: Include "Define...", "Identify and explain...", "With the aid of a diagram, explain how...", and calculation questions.
   - For DRQs: Use rich, realistic contexts (e.g., HK housing market, government policy extracts).
3. ANSWER RANDOMIZATION: Correct MCQ options MUST be evenly distributed among A, B, C, and D. DO NOT allow patterns.
4. LANGUAGE:
   - Question text, data, and options: English.
   - Marking schemes, explanations, and logic: Traditional Chinese (繁體中文).

MCQ EXPLANATION ENHANCEMENT (CRITICAL):
For EVERY MCQ question, you MUST provide a detailed "optionExplanations" array for ALL 4 options (A, B, C, D):
- For the CORRECT answer: Explain the complete economic logic and why it holds under DSE rules.
- For each INCORRECT distractor: 
  - Identify the specific fallacy (e.g., 'Confusing a change in demand with a change in quantity demanded').
  - Explain why it is wrong in the given context.
  - Address the "Common Misconception" that leads students to choose this wrong answer.

Topic: ${topic.nameEn}
Main Type: ${type}
Target Difficulty: ${difficulty}

Always return a JSON array of objects fitting the provided schema.`;

    const questionSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Professional English title of the question" },
        content: { type: Type.STRING, description: "The actual question text in English" },
        data: { type: Type.STRING, description: "Scenario data, extracts or table data in English (optional)" },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options for MCQ (English)" },
        correctOption: { type: Type.INTEGER, description: "Index 0-3 (A-D). Randomize this!" },
        optionExplanations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              option: { type: Type.STRING, description: "A, B, C, or D" },
              explanation: { type: Type.STRING, description: "Detailed Traditional Chinese explanation. For distractors, explain why it's wrong and address misconceptions." },
              isCorrect: { type: Type.BOOLEAN }
            },
            required: ["option", "explanation", "isCorrect"]
          },
          description: "Required for MCQ. Comprehensive analysis for all 4 options."
        },
        markingScheme: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              point: { type: Type.STRING, description: "The core marking point in Chinese" },
              explanation: { type: Type.STRING, description: "Detailed logical explanation in Chinese" },
              marks: { type: Type.INTEGER, description: "Marks allocated (integer)" }
            },
            required: ["point", "explanation", "marks"]
          },
          description: "Required for SQ/DRQ marking steps."
        },
        totalMarks: { type: Type.INTEGER, description: "Total marks for this question" }
      },
      required: ["title", "content", "totalMarks"]
    };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: questionSchema
        },
        temperature: 0.9, 
      },
    });

    const parsed = JSON.parse(response.text);
    return parsed.map((q: any) => ({
      ...q,
      options: q.options || [],
      optionExplanations: q.optionExplanations || [],
      markingScheme: q.markingScheme || []
    })) as GeneratedQuestion[];
  }
}

export const economicsAI = new EconomicsAIService();
