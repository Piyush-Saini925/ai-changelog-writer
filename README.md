# AI Changelog Writer

Turn messy git commits or raw diffs into clean changelogs for developers, non-technical users, or investors.

## Live Demo

Add your Vercel link here after deployment.

## Why This Exists

Developers often write useful commits, but release notes still take time to polish. This app turns rough technical input into a clean changelog that is easier to share with a team, users, or stakeholders.

## Features

- Paste commit messages, release notes, or a git diff
- Choose the target audience
- Load a demo example without API credits
- Generate a changelog with Claude 3.5 Haiku
- Copy the output
- Store your Anthropic API key only in your browser
- Friendly errors for missing keys, empty input, invalid keys, rate limits, and CORS

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Anthropic Claude API
- Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in your terminal.

## API Key Note

This MVP calls Claude directly from the browser and stores the API key in localStorage. Use a limited Anthropic API key for testing.

If the browser blocks Claude because of CORS, the fix is to add a small Vercel API route and move the Claude call there.

## Demo Mode

Use **Load Demo Example** to see the product flow without Anthropic credits. Demo mode uses built-in sample input and sample output. To process your own text, use **Generate Changelog** with your own Anthropic API key.

## Portfolio Notes

This project shows:

- AI API integration
- Practical developer-tool thinking
- Clean React UI
- Error handling
- Beginner-friendly product scope

## Future Ideas

- Add a Vercel API route
- Add markdown export
- Add changelog tone presets
- Add GitHub pull request input
- Add token/cost estimate
