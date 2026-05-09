import type { AppError, ClaudeRequest } from '../types';

const CLAUDE_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-haiku-20241022';

type ClaudeTextBlock = {
  type: 'text';
  text: string;
};

type ClaudeResponse = {
  content?: ClaudeTextBlock[];
  error?: {
    message?: string;
    type?: string;
  };
};

export class ChangelogError extends Error {
  appError: AppError;

  constructor(appError: AppError) {
    super(appError.message);
    this.name = 'ChangelogError';
    this.appError = appError;
  }
}

function buildPrompt(audience: string, rawInput: string) {
  return `Audience: ${audience}

Raw commits or diff:
${rawInput}

Generate a clean changelog. Use sections like New, Fixed, Improved, and Removed where relevant. Be concise.`;
}

function getCorsError() {
  return new ChangelogError({
    title: 'Claude blocked this browser request',
    message:
      'Claude blocked this browser request because of CORS/security rules.\n\nYour input was not sent successfully.\n\nFix:\n1. Create a small Vercel API route.\n2. Move the Claude API call there.\n3. Store the API key as a Vercel environment variable.\n4. Call your own API route from the browser instead.\n\nBeginner note: CORS means the browser blocked the request for security. It does not mean your app idea is broken.',
  });
}

function getFriendlyApiError(status: number, apiMessage?: string) {
  if (status === 401) {
    return new ChangelogError({
      title: 'Invalid API key',
      message:
        'Claude rejected the API key. Check that you copied the full Anthropic key and that it is still active.',
    });
  }

  if (status === 402) {
    return new ChangelogError({
      title: 'Anthropic account needs credits',
      message:
        'Claude could not run because the Anthropic account may need billing credits.',
    });
  }

  if (status === 429) {
    return new ChangelogError({
      title: 'Rate limit reached',
      message: 'Claude is receiving too many requests. Wait a little and try again.',
    });
  }

  return new ChangelogError({
    title: 'Claude API error',
    message: apiMessage || `Claude returned an error with status ${status}.`,
  });
}

export async function generateChangelog({
  apiKey,
  audience,
  rawInput,
}: ClaudeRequest) {
  try {
    const response = await fetch(CLAUDE_MESSAGES_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1200,
        system:
          'You are a technical writer. Convert raw git commit messages or git diffs into a clean, well-formatted changelog. Adjust the tone and language based on the audience selected by the user.',
        messages: [
          {
            role: 'user',
            content: buildPrompt(audience, rawInput),
          },
        ],
      }),
    });

    const data = (await response.json().catch(() => ({}))) as ClaudeResponse;

    if (!response.ok) {
      throw getFriendlyApiError(response.status, data.error?.message);
    }

    const output = data.content
      ?.filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n\n')
      .trim();

    if (!output) {
      throw new ChangelogError({
        title: 'No changelog returned',
        message: 'Claude responded, but no changelog text was found. Try again.',
      });
    }

    return output;
  } catch (error) {
    if (error instanceof ChangelogError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw getCorsError();
    }

    throw new ChangelogError({
      title: 'Something went wrong',
      message: 'The changelog could not be generated. Try again in a moment.',
    });
  }
}
