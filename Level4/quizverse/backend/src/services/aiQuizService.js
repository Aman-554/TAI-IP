import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIQuiz = async (topic, numberOfQuestions, difficulty) => {
    try {
        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create prompt for Gemini
        const prompt = `Generate ${numberOfQuestions} ${difficulty} difficulty multiple choice questions about "${topic}". 
    
    Return ONLY a valid JSON array with no additional text. Each question object must have exactly this structure:
    {
      "text": "question text here",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0, // index of correct option (0-3)
      "explanation": "brief explanation of the correct answer",
      "points": ${difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30}
    }
    
    Requirements:
    - Make questions engaging and educational
    - Ensure only ONE correct answer per question
    - Provide clear explanations
    - Vary the difficulty appropriately for ${difficulty} level
    - Include a mix of fact-based and conceptual questions
    
    Generate the JSON array now:`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean and parse JSON response
        let cleanedText = text.trim();
        // Remove markdown code blocks if present
        cleanedText = cleanedText.replace(/```json\n?/g, '');
        cleanedText = cleanedText.replace(/```\n?/g, '');

        // Parse the JSON
        let questions = JSON.parse(cleanedText);

        // Validate and format questions
        if (!Array.isArray(questions)) {
            throw new Error('Invalid response format: expected array');
        }

        // Ensure each question has required fields
        questions = questions.map((q, index) => ({
            text: q.text || `Question ${index + 1}`,
            options: q.options && q.options.length === 4 ? q.options : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 0,
            explanation: q.explanation || 'No explanation provided',
            points: q.points || (difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30),
            order: index
        }));

        return questions;

    } catch (error) {
        console.error('Gemini AI generation failed:', error);

        // Fallback to predefined questions if API fails
        return getFallbackQuestions(topic, numberOfQuestions, difficulty);
    }
};

// Generate quiz with streaming support (for real-time generation)
export const generateAIQuizStream = async (topic, numberOfQuestions, difficulty, onChunk) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate a ${difficulty} difficulty quiz about "${topic}" with ${numberOfQuestions} multiple choice questions.
    
    Return a valid JSON array with this exact structure:
    [{
      "text": "question",
      "options": ["opt1", "opt2", "opt3", "opt4"],
      "correctAnswer": 0,
      "explanation": "explanation"
    }]`;

        // For streaming responses
        const result = await model.generateContentStream(prompt);

        let fullResponse = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            if (onChunk) onChunk(chunkText);
        }

        // Clean and parse
        let cleanedResponse = fullResponse.trim();
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '');
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');

        const questions = JSON.parse(cleanedResponse);
        return questions;

    } catch (error) {
        console.error('Streaming generation failed:', error);
        throw error;
    }
};

// Generate quiz based on specific learning objectives
export const generateCustomQuiz = async (topic, learningObjectives, numberOfQuestions, difficulty) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Create a ${difficulty} difficulty quiz about "${topic}" focusing on these learning objectives: ${learningObjectives.join(', ')}.
    
    Generate ${numberOfQuestions} multiple choice questions in JSON format:
    [{
      "text": "question",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "detailed explanation",
      "learningObjective": "which objective this covers"
    }]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/```json\n?/g, '');
        cleanedText = cleanedText.replace(/```\n?/g, '');

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error('Custom quiz generation failed:', error);
        throw error;
    }
};

// Generate quiz from uploaded content (PDF, Text, etc.)
export const generateQuizFromContent = async (content, numberOfQuestions, difficulty) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Based on the following content, generate ${numberOfQuestions} ${difficulty} difficulty multiple choice questions:
    
    CONTENT:
    ${content.substring(0, 3000)} // Limit content length
    
    Return ONLY a JSON array with questions in this format:
    [{
      "text": "question based on content",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "explanation with reference to content"
    }]
    
    Ensure questions test understanding of the key concepts in the content.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/```json\n?/g, '');
        cleanedText = cleanedText.replace(/```\n?/g, '');

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error('Content-based quiz generation failed:', error);
        throw error;
    }
};

// Fallback questions when API fails
const getFallbackQuestions = (topic, numberOfQuestions, difficulty) => {
    const fallbackQuestions = [];
    const pointsPerQuestion = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30;

    for (let i = 0; i < Math.min(numberOfQuestions, 5); i++) {
        fallbackQuestions.push({
            text: `Sample ${difficulty} question about ${topic} #${i + 1}`,
            options: [
                'First option',
                'Second option',
                'Third option',
                'Fourth option'
            ],
            correctAnswer: 0,
            explanation: `This is a sample explanation for question ${i + 1}. In production, Gemini AI would generate more relevant questions about ${topic}.`,
            points: pointsPerQuestion,
            order: i
        });
    }

    return fallbackQuestions;
};

// Generate quiz variations (for preventing cheating)
export const generateQuizVariation = async (originalQuiz, topic) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Create a variation of this quiz about "${topic}" with different but equivalent difficulty questions:
    
    Original Quiz:
    ${JSON.stringify(originalQuiz, null, 2)}
    
    Generate a new set of questions testing the same concepts but with different wording and examples.
    Return in the same JSON format.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/```json\n?/g, '');
        cleanedText = cleanedText.replace(/```\n?/g, '');

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error('Quiz variation generation failed:', error);
        throw error;
    }
};

// Validate and enhance existing questions
export const enhanceQuestions = async (questions, topic) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Enhance these ${topic} questions by improving clarity, adding better distractors, and providing more detailed explanations:
    
    ${JSON.stringify(questions, null, 2)}
    
    Return enhanced questions in the same JSON format. Keep the same number of questions and options.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/```json\n?/g, '');
        cleanedText = cleanedText.replace(/```\n?/g, '');

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error('Question enhancement failed:', error);
        return questions; // Return original if enhancement fails
    }
};