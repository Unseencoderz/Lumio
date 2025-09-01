import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { OCRResult, GeminiAnalysisResponse } from '../types/job';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any; // Using any due to SDK type limitations

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // OCR prompt for image text extraction
  private static readonly OCR_PROMPT = `You are a high-accuracy OCR engine. Extract clean plain text from the provided image. Preserve paragraphs and line breaks. If text is partially unreadable, include "[UNREADABLE]" with confidence per page. Output strictly JSON:
{ "text": "full extracted text", "lines": ["..."], "confidence": 0.0-1.0 }`;

  // Analysis and rewrite prompt
  private static readonly ANALYSIS_PROMPT = `You are an expert social media editor. Given the "text" input below, return a JSON object with:
- sentiment: { label, score }
- readability: { fleschKincaidGrade, fleschScore }
- hashtags: array of up to 10 { tag, score, rationale }
- emojiSuggestions: array of up to 5 emojis
- engagementTips: array of 3 concise tips (max 20 words each)
- improvedText: { twitter: string<=280, instagram: string<=2200, linkedin: string }
Return only valid JSON.
Input: "<INSERT_EXTRACTED_TEXT>"`;

  // Hashtag-only prompt for low-cost operations
  private static readonly HASHTAG_PROMPT = `Return 10 ranked hashtags for the input text with a one-line rationale each. Output JSON: { "hashtags":[{"tag":"#...", "rationale":"..."}] }`;

  /**
   * Cleans the raw text response from the model to extract a valid JSON string.
   * This handles cases where the model wraps the JSON in Markdown code blocks.
   * @param rawText The raw string response from the Gemini API.
   * @returns A parsed JSON object of type T.
   */
  private cleanAndParseJson<T>(rawText: string): T {
    // Find the start and end of the JSON content by looking for the first '{' and the last '}'
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      logger.error({ rawText }, 'No JSON object found in the Gemini response.');
      throw new SyntaxError('No JSON object found in the response.');
    }

    // Extract the JSON part of the string
    const jsonString = rawText.substring(jsonStart, jsonEnd + 1);

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      logger.error({ rawText, jsonString }, 'Failed to parse cleaned JSON from Gemini response.');
      throw error; // Re-throw the original parsing error for the caller to handle
    }
  }

  async extractTextFromImage(imageBuffer: Buffer, mimeType: string): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType,
        },
      };

      const result = await this.model.generateContent([
        GeminiService.OCR_PROMPT,
        imagePart,
      ]);

      const response = await result.response;
      const text = response.text();

      // Use the helper to safely parse the JSON response
      const parsed = this.cleanAndParseJson<OCRResult>(text);
      
      logger.info({
        processingTimeMs: Date.now() - startTime,
        confidence: parsed.confidence,
        textLength: parsed.text.length,
      }, 'Gemini OCR completed');

      return parsed;
    } catch (error) {
      logger.error(error, 'Gemini OCR failed');
      throw new Error('OCR extraction failed');
    }
  }

  async analyzeText(text: string): Promise<GeminiAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      const prompt = GeminiService.ANALYSIS_PROMPT.replace('<INSERT_EXTRACTED_TEXT>', text);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Use the helper to safely parse the JSON response
      const parsed = this.cleanAndParseJson<GeminiAnalysisResponse>(responseText);
      
      // Validate and provide fallbacks for missing properties
      const validatedResponse: GeminiAnalysisResponse = {
        sentiment: parsed.sentiment || { label: 'neutral', score: 0 },
        readability: parsed.readability || { fleschKincaidGrade: 0, fleschScore: 0 },
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
        emojiSuggestions: Array.isArray(parsed.emojiSuggestions) ? parsed.emojiSuggestions : [],
        engagementTips: Array.isArray(parsed.engagementTips) ? parsed.engagementTips : [],
        improvedText: {
          twitter: parsed.improvedText?.twitter || text.substring(0, 280),
          instagram: parsed.improvedText?.instagram || text.substring(0, 2200),
          linkedin: parsed.improvedText?.linkedin || text,
        },
      };
      
      logger.info({
        processingTimeMs: Date.now() - startTime,
        textLength: text.length,
        hashtagCount: validatedResponse.hashtags.length,
      }, 'Gemini analysis completed');

      return validatedResponse;
    } catch (error) {
      logger.error(error, 'Gemini analysis failed');
      throw new Error('Text analysis failed');
    }
  }

  async generateHashtags(text: string): Promise<Array<{ tag: string; rationale: string }>> {
    const startTime = Date.now();
    
    try {
      const prompt = `${GeminiService.HASHTAG_PROMPT}\nInput: ${text}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Use the helper to safely parse the JSON response
      const parsed = this.cleanAndParseJson<{ hashtags: Array<{ tag: string; rationale: string }> }>(responseText);
      
      // Validate hashtags array
      const hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags : [];
      
      logger.info({
        processingTimeMs: Date.now() - startTime,
        hashtagCount: hashtags.length,
      }, 'Gemini hashtag generation completed');

      return hashtags;
    } catch (error) {
      logger.error(error, 'Gemini hashtag generation failed');
      throw new Error('Hashtag generation failed');
    }
  }

  // Retry logic with exponential backoff
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000,
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        logger.warn({
          attempt,
          maxRetries,
          delay,
          error: lastError.message,
        }, 'Retrying Gemini operation');
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}

export const geminiService = new GeminiService();

