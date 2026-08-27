import { ChatRolePreset, ModelOption } from '../types';

export const GEMINI_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    tagline: 'General Tasks (Default)',
    description: 'High intelligence, responsive, and versatile for everyday conversations and queries.',
    speed: 'Balanced',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconName: 'Zap',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    tagline: 'Complex Reasoning & Code',
    description: 'Specialized for advanced reasoning, multi-step code architecture, and analytical depth.',
    speed: 'Deep Reasoning',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconName: 'Cpu',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tagline: 'Ultra Fast & Concise',
    description: 'Optimized for minimum latency, instant turnarounds, and succinct summaries.',
    speed: 'Fastest',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconName: 'Gauge',
  },
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    tagline: 'Latest Hybrid Reasoning',
    description: 'Versatile model with enhanced nuance and multi-domain understanding.',
    speed: 'Balanced',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconName: 'Sparkles',
  },
];

export const ROLE_PRESETS: ChatRolePreset[] = [
  {
    id: 'helpful-assistant',
    name: 'Helpful Assistant',
    icon: 'Bot',
    description: 'Friendly, balanced, articulate conversationalist for general questions.',
    systemInstruction:
      'You are Gemini, a helpful, intelligent, and friendly AI assistant. Provide clear, direct, and well-structured answers using markdown when appropriate. Be conversational, polite, and accurate.',
    starterPrompts: [
      'Explain quantum computing in simple terms with an analogy.',
      'Help me plan a 3-day trip itinerary to Tokyo.',
      'What are the key differences between SQL and NoSQL databases?',
      'Draft a polite email asking for a project deadline extension.',
    ],
  },
  {
    id: 'senior-engineer',
    name: 'Senior Software Engineer',
    icon: 'Code2',
    description: 'Expert coding mentor, architectural reviewer, and debugging specialist.',
    systemInstruction:
      'You are a Principal Software Engineer and System Architect with deep expertise across modern TypeScript, React, distributed systems, algorithms, and clean architecture. When writing code, provide clean, idiomatic, typed, and well-commented code snippets. Point out edge cases, time/space complexity, and security considerations.',
    starterPrompts: [
      'Review this TypeScript function for race conditions and memory leaks.',
      'Design an event-driven architecture for real-time notification delivery.',
      'Explain how React 19 server actions and transitions work under the hood.',
      'Write a generic debounce function in TypeScript with cancel and flush support.',
    ],
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer & Storyteller',
    icon: 'PenTool',
    description: 'Imaginative storyteller, character builder, and prose stylist.',
    systemInstruction:
      'You are an award-winning novelist and creative editor. You write with vivid imagery, rhythmic pacing, memorable metaphors, and deep emotional resonance. Avoid cliches and generic tropes.',
    starterPrompts: [
      'Write the opening scene of a noir mystery set on an orbital space station.',
      'Describe a forgotten antique shop through the eyes of a time traveler.',
      'Develop three intriguing character concepts with conflicting motives.',
      'Craft a poetic reflection on the stillness of early dawn in the city.',
    ],
  },
  {
    id: 'executive-coach',
    name: 'Concise Executive Strategist',
    icon: 'Briefcase',
    description: 'Action-oriented, data-driven advisor with bulleted strategic clarity.',
    systemInstruction:
      'You are a C-suite strategy consultant and executive advisor. Deliver high-impact, actionable, no-fluff executive briefings. Use bullet points, bold takeaways, and clear risk/opportunity trade-offs.',
    starterPrompts: [
      'How to evaluate build vs. buy for an internal data pipeline tool?',
      'Create a 90-day onboarding strategy for a newly appointed VP of Engineering.',
      'Framework for prioritizing product roadmap features with limited engineering capacity.',
      'Draft a crisp quarterly investor update structure.',
    ],
  },
  {
    id: 'socratic-tutor',
    name: 'Socratic Tutor',
    icon: 'GraduationCap',
    description: 'Guides learning through structured inquiry, hints, and active questions.',
    systemInstruction:
      'You are a Socratic tutor. Instead of immediately giving complete answers to complex problems, guide the student through guided questions, intuitive hints, and step-by-step discovery to help them derive the solution themselves.',
    starterPrompts: [
      'Help me understand how backpropagation works in neural networks step by step.',
      'Why is O(log n) search faster than O(n), and how do trees facilitate this?',
      'Guide me through solving this logic riddle about truth-tellers and liars.',
      'Explain the intuition behind the Central Limit Theorem.',
    ],
  },
];
