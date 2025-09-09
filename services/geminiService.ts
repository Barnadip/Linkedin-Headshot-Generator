import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            resolve(result);
        };
        reader.onerror = error => reject(error);
    });
};

export const generateHeadshot = async (
    base64Image: string,
    attire: string,
    background: string,
    isEnhanced: boolean
): Promise<string | null> => {
    let prompt = `Generate a professional, high-quality LinkedIn headshot. Use the face and hair from the person in the provided image. Replace their current clothing with a '${attire}'. Place them against a '${background}' background. The final image should be photorealistic, well-lit, and cropped appropriately for a profile picture (shoulders up). Maintain the person's natural facial features. Do not add any text or watermarks.`;

    if (isEnhanced) {
        prompt += ` Additionally, subtly adjust the person's pose to be more forward-facing and improve the lighting to be more professional and flattering. Ensure the final result looks natural and maintains the person's identity.`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    // Find the image part in the response
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data; // Return the base64 string of the generated image
        }
    }

    // If no image is found in the response
    return null;
};