import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const analyzeCVWithGemini = async (cvText, jobRole) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze this CV for a ${jobRole} position in Bangladesh. Provide specific feedback on:
      1. Formatting and structure improvements for Bangladeshi standards
      2. Skills gap analysis for the target role
      3. Keyword optimization for ATS systems
      4. Achievement quantification suggestions
      5. Education and certification formatting (convert S.S.C. to proper format)
      
      CV Content:
      ${cvText}
      
      Provide response in JSON format with sections: summary, strengths, improvements, score (0-100), and specific recommendations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze CV");
  }
};

export const generateInterviewQuestions = async (domain, experienceLevel) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Generate 5 interview questions for a ${experienceLevel} level ${domain} position in Bangladesh.
      Include both technical and behavioral questions relevant to the Bangladeshi job market.
      For each question, provide:
      - The question
      - What the interviewer is looking for
      - A sample ideal answer
      - Keywords to include
      
      Domain: ${domain}
      Experience Level: ${experienceLevel}
      
      Provide response in JSON format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate questions");
  }
};

export const evaluateAnswerWithGemini = async (question, answer, context) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Evaluate this interview answer for a ${context.role} position in Bangladesh.
      
      Question: ${question}
      Answer: ${answer}
      
      Candidate Background: ${context.experience} experience, ${context.education}
      
      Provide evaluation with:
      - Score (0-100)
      - Strengths
      - Improvements needed
      - Cultural relevance for Bangladesh
      - Suggested better answer
      
      Provide response in JSON format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to evaluate answer");
  }
};
