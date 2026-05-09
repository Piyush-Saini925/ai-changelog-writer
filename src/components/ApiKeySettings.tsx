type ApiKeySettingsProps = {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSave: () => void;
  onClear: () => void;
  saved: boolean;
};

export function ApiKeySettings({
  apiKey,
  onApiKeyChange,
  onSave,
  onClear,
  saved,
}: ApiKeySettingsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-slate-950">Anthropic API key</h2>
        <p className="mt-1 text-sm text-slate-600">
          Stored only in your browser. Use a limited key for this demo.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="min-h-11 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
          type="password"
          value={apiKey}
          placeholder="sk-ant-api03-..."
          onChange={(event) => onApiKeyChange(event.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="min-h-11 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            type="button"
            onClick={onSave}
            disabled={!apiKey.trim()}
          >
            Save
          </button>
          <button
            className="min-h-11 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            type="button"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
      </div>

      {saved ? (
        <p className="mt-3 text-sm font-medium text-emerald-700">API key saved.</p>
      ) : null}
    </section>
  );
}
