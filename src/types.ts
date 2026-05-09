export type Audience = 'Developers' | 'Non-technical users' | 'Investors';

export type ClaudeRequest = {
  apiKey: string;
  audience: Audience;
  rawInput: string;
};

export type AppError = {
  title: string;
  message: string;
};
