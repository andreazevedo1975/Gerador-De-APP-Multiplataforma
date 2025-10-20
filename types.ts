export enum Platform {
  Windows = 'Windows',
  Android = 'Android',
  iOS = 'iOS',
}

export interface FormData {
  appName: string;
  platforms: Platform[];
  appDescription: string;
  designStyle: 'Light' | 'Dark';
  primaryColor: string;
}

export interface GeneratedFile {
  fileName: string;
  language: string;
  code: string;
}

export interface GeminiResponse {
  frameworkRecommendation: string;
  reasoning: string;
  files: GeneratedFile[];
  nextSteps: string[];
}
