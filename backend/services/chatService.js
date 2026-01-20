const axios = require('axios');
const jobService = require('./jobService');

class ChatService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  async processQuery(userQuery, context = {}) {
    if (!this.openaiApiKey) {
      return this.fallbackResponse(userQuery, context);
    }

    try {
      const systemPrompt = `You are a helpful job search assistant. You help users find jobs and answer questions about the job tracker app.
      
      Available filters users can use:
      - Role/Title: Search by job title
      - Skills: Multi-select skills (React, Node.js, Python, etc.)
      - Date Posted: Last 24 hours, Last week, Last month
      - Job Type: Full-time, Part-time, Contract, Internship
      - Work Mode: Remote, Hybrid, On-site
      - Location: City/region filter
      - Match Score: High (>70%), Medium (40-70%), Low (<40%)
      
      App Features:
      - Job Feed: Shows available jobs with match scores
      - Applications: Track your job applications
      - Resume: Upload and update your resume
      - Settings: Update preferences
      
      When users ask about jobs, extract filters from their query and respond with:
      1. A natural language answer
      2. Extracted filters in JSON format
      3. Suggested next steps
      
      When users ask about the app, give clear instructions.`;
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery }
          ],
          temperature: 0.3,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      
      // Try to extract filters from AI response
      const filters = this.extractFiltersFromQuery(userQuery);
      
      return {
        response: aiResponse,
        filters,
        type: this.determineQueryType(userQuery)
      };
      
    } catch (error) {
      console.error('Chat service error:', error);
      return this.fallbackResponse(userQuery, context);
    }
  }

  extractFiltersFromQuery(query) {
    const filters = {};
    query = query.toLowerCase();
    
    // Extract job type
    if (query.includes('full-time') || query.includes('full time')) {
      filters.job_type = 'fulltime';
    } else if (query.includes('part-time') || query.includes('part time')) {
      filters.job_type = 'parttime';
    } else if (query.includes('contract')) {
      filters.job_type = 'contractor';
    } else if (query.includes('intern')) {
      filters.job_type = 'intern';
    }
    
    // Extract work mode
    if (query.includes('remote')) {
      filters.work_mode = 'remote';
    } else if (query.includes('hybrid')) {
      filters.work_mode = 'hybrid';
    } else if (query.includes('onsite') || query.includes('on-site')) {
      filters.work_mode = 'onsite';
    }
    
    // Extract skills
    const skills = ['react', 'node', 'python', 'javascript', 'typescript', 'figma', 'ux'];
    const foundSkills = skills.filter(skill => query.includes(skill));
    if (foundSkills.length > 0) {
      filters.skills = foundSkills.join(',');
    }
    
    // Extract location
    const locations = ['san francisco', 'new york', 'austin', 'chicago', 'boston', 'seattle'];
    for (const location of locations) {
      if (query.includes(location)) {
        filters.location = location;
        break;
      }
    }
    
    // Extract date
    if (query.includes('today') || query.includes('24 hour')) {
      filters.date_posted = '24h';
    } else if (query.includes('this week') || query.includes('week')) {
      filters.date_posted = 'week';
    }
    
    // Extract seniority
    if (query.includes('senior')) {
      filters.query = 'senior developer';
    } else if (query.includes('junior')) {
      filters.query = 'junior developer';
    }
    
    return filters;
  }

  determineQueryType(query) {
    query = query.toLowerCase();
    
    if (query.includes('application') || query.includes('applied')) {
      return 'applications';
    } else if (query.includes('resume') || query.includes('upload')) {
      return 'resume';
    } else if (query.includes('match') || query.includes('score')) {
      return 'matching';
    } else if (query.includes('how') || query.includes('where') || query.includes('what')) {
      return 'help';
    } else {
      return 'jobs';
    }
  }

  fallbackResponse(query, context) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('remote react')) {
      return {
        response: "I'll show you remote React jobs. These positions typically require React, JavaScript, and modern frontend frameworks. I'm filtering for remote positions with React in the requirements.",
        filters: { skills: 'react', work_mode: 'remote' },
        type: 'jobs'
      };
    } else if (lowerQuery.includes('ux') || lowerQuery.includes('figma')) {
      return {
        response: "Here are UX/UI design jobs requiring Figma. These positions often need skills in user research, wireframing, and design systems.",
        filters: { skills: 'figma', query: 'ux designer' },
        type: 'jobs'
      };
    } else if (lowerQuery.includes('application')) {
      return {
        response: "You can view your applications in the 'Applications' section in the sidebar. There you'll see all jobs you've applied to, with their current status and timeline.",
        filters: {},
        type: 'help'
      };
    } else {
      return {
        response: "I can help you find jobs, track applications, and answer questions about the job tracker. Try asking about specific jobs or features!",
        filters: {},
        type: 'help'
      };
    }
  }
}

module.exports = new ChatService();