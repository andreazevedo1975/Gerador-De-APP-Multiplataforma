import { GoogleGenAI, Type } from '@google/genai';
import { FormData, GeminiResponse } from '../types';

// The API key is automatically sourced from the environment variable `process.env.API_KEY`
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        frameworkRecommendation: {
            type: Type.STRING,
            description: "The recommended multi-platform framework (e.g., Flutter, React Native).",
        },
        reasoning: {
            type: Type.STRING,
            description: "A brief explanation for why this framework was chosen.",
        },
        files: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    fileName: { type: Type.STRING, description: "The name of the file, e.g., 'main.dart' or 'App.js'." },
                    language: { type: Type.STRING, description: "The programming language of the code, e.g. 'dart', 'javascript', 'yaml', 'xml'." },
                    code: { type: Type.STRING, description: "The full content of the file." },
                },
                required: ["fileName", "language", "code"],
            },
        },
        nextSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of command-line steps for the user to set up their project and use the generated files."
        },
    },
    required: ["frameworkRecommendation", "reasoning", "files", "nextSteps"],
};


export const generateAppCode = async (formData: FormData): Promise<GeminiResponse> => {
    const { appName, platforms, appDescription, designStyle, primaryColor } = formData;

    const prompt = `
        **User Request:**
        - **App Name:** ${appName}
        - **Target Platforms:** ${platforms.join(', ')}
        - **App Description:** ${appDescription}
        - **Design Preference:** ${designStyle} Mode with a primary color of ${primaryColor}.

        **Your Task:**
        Act as an expert multi-platform app developer specializing in Flutter and React Native. Based on the user's request, generate the foundational code for a new application.
        1.  Choose the best framework (either Flutter or React Native) and briefly explain why it's a good fit.
        2.  Provide the code for the most important initial files. For Flutter, this should include 'main.dart' and 'pubspec.yaml'. For React Native, include 'App.js' and 'package.json'.
        3.  The generated UI code must be simple but stylish, and it MUST reflect the user's design preference (theme: ${designStyle}, primary color: ${primaryColor}).
        4.  Provide a clear, step-by-step list of terminal commands for the user to create the project and use the generated files.
        5.  Return the entire response in the specified JSON format, with no markdown formatting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
            }
        });

        const jsonText = response.text.trim();
        // The response from Gemini with responseSchema is already a clean JSON string.
        const parsedResponse: GeminiResponse = JSON.parse(jsonText);
        return parsedResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Falha ao gerar o código do aplicativo. A IA pode ter retornado um formato inválido ou ocorreu um erro.");
    }
};
