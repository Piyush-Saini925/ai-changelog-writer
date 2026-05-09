type OutputPanelProps = {
  output: string;
  copied: boolean;
  onCopy: () => void;
};

export function OutputPanel({ output, copied, onCopy }: OutputPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Generated changelog</h2>
          <p className="mt-1 text-sm text-slate-600">Clean output ready to paste into a release note.</p>
        </div>

        <button
          className="min-h-11 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          type="button"
          onClick={onCopy}
          disabled={!output}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="min-h-72 rounded-md border border-slate-200 bg-slate-50 p-4">
        {output ? (
          <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-900">{output}</pre>
        ) : (
          <div className="flex min-h-60 items-center justify-center text-center text-sm text-slate-500">
            Your AI-generated changelog will appear here.
          </div>
        )}
      </div>
    </section>
  );
}
