export type SuggestionType = 'success' | 'warning' | 'error';

export interface Suggestion {
  type: SuggestionType;
  message: string;
  suggestion?: string;
}

export interface ResumeAnalysis {
  matchScore: number;
  suggestions: {
    skills: Suggestion[];
    experience: Suggestion[];
    education: Suggestion[];
    formatting: Suggestion[];
  };
}

const domainKeywords = {
  software: [
    'programming',
    'development',
    'software',
    'web',
    'api',
    'database',
    'cloud',
    'agile',
    'git',
    'javascript',
    'python',
    'java',
    'react',
    'node',
    'devops',
    'aws',
    'docker',
    'kubernetes',
    'microservices',
    'ci/cd',
  ],
  marketing: [
    'marketing',
    'social media',
    'seo',
    'content',
    'analytics',
    'campaign',
    'brand',
    'strategy',
    'digital marketing',
    'email marketing',
    'ppc',
    'conversion',
    'market research',
    'advertising',
    'crm',
    'lead generation',
    'marketing automation',
    'google analytics',
    'social media marketing',
    'content strategy',
  ],
  finance: [
    'financial',
    'accounting',
    'budget',
    'analysis',
    'investment',
    'risk',
    'portfolio',
    'forecasting',
    'banking',
    'trading',
    'compliance',
    'audit',
    'tax',
    'revenue',
    'profit',
    'financial planning',
    'wealth management',
    'financial analysis',
    'financial reporting',
    'business intelligence',
  ],
  healthcare: [
    'patient',
    'clinical',
    'medical',
    'healthcare',
    'treatment',
    'diagnosis',
    'care',
    'health',
    'nursing',
    'hospital',
    'pharmacy',
    'patient care',
    'medical records',
    'hipaa',
    'electronic health records',
    'healthcare management',
    'clinical trials',
    'patient safety',
    'medical procedures',
    'healthcare compliance',
  ],
};

export const analyzeResume = async (
  resumeText: string,
  jobDescription: string,
  domain: keyof typeof domainKeywords
): Promise<ResumeAnalysis> => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const domainWords = domainKeywords[domain];
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const jobWords = jobDescription.toLowerCase().split(/\s+/);

  // Calculate domain-specific keyword matches
  const domainMatches = domainWords.filter(
    (word) => resumeWords.includes(word) || jobWords.includes(word)
  ).length;

  const matchScore = Math.min(
    Math.round((domainMatches / domainWords.length) * 100),
    100
  );

  // Generate domain-specific suggestions
  const analysis: ResumeAnalysis = {
    matchScore,
    suggestions: {
      skills: [],
      experience: [],
      education: [],
      formatting: [],
    },
  };

  // Add domain-specific suggestions
  switch (domain) {
    case 'software':
      analysis.suggestions.skills = [
        {
          type: matchScore > 70 ? 'success' : 'warning',
          message: matchScore > 70 
            ? 'Strong technical skills alignment with job requirements'
            : 'Technical skills could be better aligned with job requirements',
          suggestion: matchScore <= 70 ? 'Consider adding experience with key technologies mentioned in the job description' : undefined,
        },
        {
          type: 'warning',
          message: 'Consider expanding cloud and DevOps skills',
          suggestion: 'Include experience with AWS, Docker, or Kubernetes if applicable',
        },
      ];
      break;

    case 'marketing':
      analysis.suggestions.skills = [
        {
          type: matchScore > 70 ? 'success' : 'warning',
          message: matchScore > 70 
            ? 'Strong digital marketing skills present'
            : 'Digital marketing skills could be enhanced',
          suggestion: matchScore <= 70 ? 'Add experience with modern marketing tools and platforms' : undefined,
        },
        {
          type: 'warning',
          message: 'Analytics and data-driven marketing skills could be expanded',
          suggestion: 'Highlight experience with Google Analytics, SEO tools, and marketing automation platforms',
        },
      ];
      break;

    case 'finance':
      analysis.suggestions.skills = [
        {
          type: matchScore > 70 ? 'success' : 'warning',
          message: matchScore > 70 
            ? 'Strong financial analysis skills highlighted'
            : 'Financial analysis skills could be more prominent',
          suggestion: matchScore <= 70 ? 'Emphasize experience with financial modeling and analysis tools' : undefined,
        },
        {
          type: 'warning',
          message: 'Consider adding more specific financial software expertise',
          suggestion: 'Include experience with Bloomberg Terminal, Excel financial modeling, or relevant financial software',
        },
      ];
      break;

    case 'healthcare':
      analysis.suggestions.skills = [
        {
          type: matchScore > 70 ? 'success' : 'warning',
          message: matchScore > 70 
            ? 'Strong healthcare domain knowledge demonstrated'
            : 'Healthcare-specific expertise could be enhanced',
          suggestion: matchScore <= 70 ? 'Highlight relevant certifications and healthcare systems experience' : undefined,
        },
        {
          type: 'warning',
          message: 'Healthcare compliance and regulations knowledge could be expanded',
          suggestion: 'Emphasize experience with HIPAA compliance and healthcare regulations',
        },
      ];
      break;
  }

  // Add common suggestions
  analysis.suggestions.experience = [
    {
      type: 'success',
      message: 'Work experience is presented chronologically',
    },
    {
      type: 'warning',
      message: 'Quantifiable achievements could be improved',
      suggestion: 'Add specific metrics, percentages, and results to your achievements',
    },
  ];

  analysis.suggestions.education = [
    {
      type: 'success',
      message: 'Education section is well-formatted',
    },
    {
      type: 'warning',
      message: 'Consider adding relevant certifications',
      suggestion: 'Include industry-specific certifications and continuing education',
    },
  ];

  analysis.suggestions.formatting = [
    {
      type: 'success',
      message: 'Resume length is appropriate',
    },
    {
      type: 'warning',
      message: 'Action verbs could be more impactful',
      suggestion: 'Use strong action verbs to begin bullet points (e.g., "Implemented," "Developed," "Led")',
    },
  ];

  return analysis;
};