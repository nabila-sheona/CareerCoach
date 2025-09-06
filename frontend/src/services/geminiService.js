import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAJSPTk7_Bmrff_2AHNdWjIhhJTEPA3LYM';
const genAI = new GoogleGenerativeAI(API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeCVAgainstJob(cvText, jobDescription) {
    try {
      const prompt = `
You are an expert HR professional and career coach. Analyze the following CV against the provided job description and provide detailed feedback.

CV Content:
${cvText}

Job Description:
${jobDescription}

Please provide your analysis in the following JSON format:
{
  "overallMatch": {
    "score": 85,
    "summary": "Brief overall assessment"
  },
  "strengths": [
    "List of CV strengths relevant to the job"
  ],
  "weaknesses": [
    "List of areas that need improvement"
  ],
  "missingSkills": [
    "Skills mentioned in job description but missing from CV"
  ],
  "recommendations": [
    {
      "category": "Skills",
      "suggestion": "Specific improvement suggestion",
      "priority": "high|medium|low"
    }
  ],
  "keywordOptimization": {
    "missingKeywords": ["keyword1", "keyword2"],
    "suggestions": "How to incorporate these keywords naturally"
  },
  "formatting": {
    "score": 8,
    "suggestions": "Formatting improvement suggestions"
  },
  "suitability": {
    "verdict": "Highly Suitable|Suitable|Needs Improvement|Not Suitable",
    "reasoning": "Detailed explanation of the verdict"
  }
}

Provide constructive, actionable feedback that will help the candidate improve their CV for this specific role. Be specific and practical in your recommendations.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from the response
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // Return a fallback structure with the raw text
        return {
          overallMatch: {
            score: 0,
            summary: 'Analysis completed but formatting error occurred'
          },
          strengths: [],
          weaknesses: [],
          missingSkills: [],
          recommendations: [{
            category: 'General',
            suggestion: text,
            priority: 'medium'
          }],
          keywordOptimization: {
            missingKeywords: [],
            suggestions: 'Please review the full analysis above'
          },
          formatting: {
            score: 5,
            suggestions: 'Unable to analyze formatting due to parsing error'
          },
          suitability: {
            verdict: 'Needs Review',
            reasoning: 'Analysis completed but requires manual review due to formatting issues'
          },
          rawResponse: text
        };
      }
    } catch (error) {
      console.error('Error analyzing CV with Gemini:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        name: error.name
      });
      
      // Provide more specific error messages based on error type
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('403')) {
        throw new Error('Invalid API key. Please check the Gemini API configuration.');
      } else if (error.message?.includes('RATE_LIMIT') || error.message?.includes('429')) {
        throw new Error('API rate limit exceeded. Please try again in a few minutes.');
      } else if (error.message?.includes('NETWORK') || !navigator.onLine) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      } else {
        throw new Error(`Failed to analyze CV: ${error.message || 'Unknown error occurred'}`);
      }
    }
  }

  async generateJobMatchScore(cvText, jobDescription) {
    try {
      const prompt = `
Analyze how well this CV matches the job requirements and provide a compatibility score from 0-100.

CV:
${cvText}

Job Description:
${jobDescription}

Provide only a number between 0-100 representing the match percentage.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Extract number from response
      const scoreMatch = text.match(/\d+/);
      return scoreMatch ? parseInt(scoreMatch[0]) : 50;
    } catch (error) {
      console.error('Error generating match score:', error);
      return 50; // Default score on error
    }
  }

  async improveCVSection(sectionText, jobRequirements, sectionType) {
    try {
      const prompt = `
Improve the following ${sectionType} section of a CV to better match these job requirements:

Current ${sectionType} section:
${sectionText}

Job Requirements:
${jobRequirements}

Provide an improved version that:
1. Better aligns with the job requirements
2. Uses relevant keywords naturally
3. Maintains professional tone
4. Highlights relevant achievements

Improved ${sectionType} section:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error improving CV section:', error);
      throw new Error('Failed to generate improved section');
    }
  }
}

export default new GeminiService();