const API_KEY_STORAGE_KEY = 'ai-changelog-writer:anthropic-api-key';

export function loadApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) ?? '';
}

export function saveApiKey(apiKey: string) {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}
