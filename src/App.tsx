import { useEffect, useState } from 'react';
import { ApiKeySettings } from './components/ApiKeySettings';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ChangelogError, generateChangelog } from './services/claude';
import type { AppError, Audience } from './types';
import { clearApiKey, loadApiKey, saveApiKey } from './utils/storage';

const sampleInput = `feat: add team invite modal
fix: prevent crash when changelog has empty sections
chore: upgrade vite and tailwind packages
refactor: simplify release note formatter
docs: add setup instructions for new contributors`;

const demoInput = `feat: added login page but styling is still rough
fix: fixed crash when user clicks save with empty email
update: changed dashboard cards to show revenue and active users
bugfix: mobile navbar was overlapping the profile button
feat: added export to CSV for reports
refactor: cleaned up auth helper functions
fix: password reset email now sends correctly
remove: deleted old settings modal
docs: updated README setup steps
perf: reduced dashboard loading time by caching user stats`;

const demoOutput = `# Changelog

## New
- Added a login page.
- Added CSV export for reports.
- Added dashboard cards for revenue and active users.

## Fixed
- Fixed a crash when saving with an empty email.
- Fixed the mobile navbar overlapping the profile button.
- Fixed password reset emails so they send correctly.

## Improved
- Reduced dashboard loading time by caching user stats.
- Cleaned up authentication helper functions.
- Updated README setup instructions.

## Removed
- Removed the old settings modal.`;

function App() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [rawInput, setRawInput] = useState(sampleInput);
  const [audience, setAudience] = useState<Audience>('Developers');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setApiKey(loadApiKey());
  }, []);

  function handleSaveKey() {
    saveApiKey(apiKey.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function handleClearKey() {
    clearApiKey();
    setApiKey('');
    setSaved(false);
  }

  async function handleGenerate() {
    setError(null);
    setCopied(false);

    if (!apiKey.trim()) {
      setError({
        title: 'API key required',
        message: 'Add your Anthropic API key first, then generate the changelog.',
      });
      return;
    }

    if (!rawInput.trim()) {
      setError({
        title: 'Input required',
        message: 'Paste commit messages or a git diff before generating.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const changelog = await generateChangelog({
        apiKey: apiKey.trim(),
        audience,
        rawInput: rawInput.trim(),
      });
      setOutput(changelog);
    } catch (caughtError) {
      if (caughtError instanceof ChangelogError) {
        setError(caughtError.appError);
      } else {
        setError({
          title: 'Generation failed',
          message: 'The changelog could not be generated. Try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleTryDemo() {
    setRawInput(demoInput);
    setAudience('Developers');
    setOutput(demoOutput);
    setError(null);
    setCopied(false);
  }

  async function handleCopy() {
    if (!output) {
      return;
    }

    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">AI dev tool</p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                AI Changelog Writer
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                Turn messy commits and diffs into clean release notes for developers, users, or investors.
              </p>
            </div>
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noreferrer"
            >
              Get Anthropic key
            </a>
          </div>
        </header>

        <div className="grid gap-4">
          <ApiKeySettings
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            onSave={handleSaveKey}
            onClear={handleClearKey}
            saved={saved}
          />

          {error ? (
            <section className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-950">
              <h2 className="text-sm font-semibold">{error.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{error.message}</p>
            </section>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <InputPanel
              rawInput={rawInput}
              audience={audience}
              isLoading={isLoading}
              onRawInputChange={setRawInput}
              onAudienceChange={setAudience}
              onGenerate={handleGenerate}
              onTryDemo={handleTryDemo}
            />
            <OutputPanel output={output} copied={copied} onCopy={handleCopy} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
