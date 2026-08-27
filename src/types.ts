export type RoleType = 'user' | 'assistant' | 'model' | 'system';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  modelUsed?: string;
  isError?: boolean;
}

export type GeminiModelId = 
  | 'gemini-3.5-flash'
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.1-flash-lite'
  | 'gemini-3.7-flash';

export interface ModelOption {
  id: GeminiModelId;
  name: string;
  tagline: string;
  description: string;
  speed: 'Fastest' | 'Balanced' | 'Deep Reasoning';
  badgeColor: string;
  iconName: string;
}

export interface ChatRolePreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemInstruction: string;
  starterPrompts: string[];
}
