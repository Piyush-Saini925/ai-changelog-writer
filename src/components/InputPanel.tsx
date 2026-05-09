import type { Audience } from '../types';

const audiences: Audience[] = ['Developers', 'Non-technical users', 'Investors'];

type InputPanelProps = {
  rawInput: string;
  audience: Audience;
  isLoading: boolean;
  onRawInputChange: (value: string) => void;
  onAudienceChange: (value: Audience) => void;
  onGenerate: () => void;
  onTryDemo: () => void;
};

export function InputPanel({
  rawInput,
  audience,
  isLoading,
  onRawInputChange,
  onAudienceChange,
  onGenerate,
  onTryDemo,
}: InputPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Raw commits or diff</h2>
          <p className="mt-1 text-sm text-slate-600">
            Paste messy commit messages, release notes, or a git diff.
          </p>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Audience
          <select
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            value={audience}
            onChange={(event) => onAudienceChange(event.target.value as Audience)}
          >
            {audiences.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <textarea
        className="min-h-72 w-full resize-y rounded-md border border-slate-300 p-3 font-mono text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
        value={rawInput}
        placeholder="Example:&#10;feat: add password reset screen&#10;fix: stop settings page crash on mobile&#10;refactor: simplify billing API response"
        onChange={(event) => onRawInputChange(event.target.value)}
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">{rawInput.length.toLocaleString()} characters</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="min-h-11 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            type="button"
            onClick={onTryDemo}
          >
            Load Demo Example
          </button>
          <button
            className="min-h-11 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Changelog'}
          </button>
        </div>
      </div>
    </section>
  );
}
