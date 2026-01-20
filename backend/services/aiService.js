const axios = require('axios');

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  async calculateMatchScore(resumeText, jobDescription) {
    if (!this.openaiApiKey) {
      // Fallback to simple keyword matching
      return this.simpleMatchScore(resumeText, jobDescription);
    }

    try {
      const prompt = `Compare this resume with job description and give a match percentage (0-100).
      Resume: ${resumeText.substring(0, 1000)}
      Job: ${jobDescription.substring(0, 1000)}
      
      Return ONLY a JSON with: {score: number, reasons: string[]}`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 200
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.simpleMatchScore(resumeText, jobDescription);
    }
  }

  simpleMatchScore(resumeText, jobDescription) {
    const resumeSkills = this.extractSkills(resumeText);
    const jobSkills = this.extractSkills(jobDescription);
    
    const matchingSkills = resumeSkills.filter(skill => 
      jobSkills.includes(skill)
    );
    
    const score = (matchingSkills.length / Math.max(jobSkills.length, 1)) * 100;
    
    return {
      score: Math.round(score),
      reasons: matchingSkills.map(skill => `Matched skill: ${skill}`)
    };
  }

  extractSkills(text) {
    const commonSkills = ['react', 'node', 'python', 'javascript', 'typescript', 
                         'aws', 'docker', 'kubernetes', 'html', 'css', 'mongodb', 
                         'postgresql', 'graphql', 'redux', 'vue', 'angular'];
    
    return commonSkills.filter(skill => 
      text.toLowerCase().includes(skill)
    );
  }
}

module.exports = new AIService();