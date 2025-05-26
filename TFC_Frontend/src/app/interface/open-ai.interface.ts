export interface OpenAIChatCompletionResponse {
  id: string;
  object: string; // "chat.completion"
  created: number;
  model: string;  // e.g. "gpt-4.1-2025-04-14"
  choices: Choice[];
  usage: Usage;
  service_tier: string; // e.g. "default"
}

export interface Choice {
  index: number;
  message: ChatMessage;
  logprobs: null;
  finish_reason: string; // e.g. "stop"
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  refusal: null | string;
  annotations: any[]; // May be more specific if you use them
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_tokens_details: TokenDetails;
  completion_tokens_details: CompletionTokenDetails;
}

export interface TokenDetails {
  cached_tokens: number;
  audio_tokens: number;
}

export interface CompletionTokenDetails {
  reasoning_tokens: number;
  audio_tokens: number;
  accepted_prediction_tokens: number;
  rejected_prediction_tokens: number;
}
