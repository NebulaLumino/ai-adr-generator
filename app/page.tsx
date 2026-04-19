'use client';

import { useState } from 'react';

export default function Home() {
  const [context, setContext] = useState('');
  const [decision, setDecision] = useState('');
  const [options, setOptions] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, decision, options }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setOutput(data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-teal-400 mb-3">📝 AI Architecture Decision Record (ADR) Generator</h1>
          <p className="text-gray-400 text-lg">Document architectural decisions with structured, professional ADRs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Decision Context & Problem</label>
              <textarea
                className="w-full h-36 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder={'Describe the problem or context...\n\nExample:\nWe need to choose a state management solution for our React app. The app has 50+ components, complex form state, and needs to handle real-time data from WebSockets.'}
                value={context}
                onChange={e => setContext(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Chosen Decision (optional)</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Use Redux Toolkit with RTK Query"
                value={decision}
                onChange={e => setDecision(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Options Considered (optional)</label>
              <textarea
                className="w-full h-28 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-100 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder={'Option A: Redux Toolkit\nOption B: Zustand\nOption C: Jotai\nOption D: React Context + useReducer'}
                value={options}
                onChange={e => setOptions(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-gray-300">
              <p className="font-semibold text-teal-400 mb-2">📋 ADR Format (Nolloway):</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Title</strong> — e.g. ADR-001: Use Postgres as Primary DB</li>
                <li>• <strong>Status</strong> — Proposed / Accepted / Deprecated</li>
                <li>• <strong>Context</strong> — The problem and constraints</li>
                <li>• <strong>Decision</strong> — What was chosen</li>
                <li>• <strong>Consequences</strong> — Good and bad outcomes</li>
              </ul>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !context.trim()}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? '⏳ Writing ADR...' : '📝 Generate ADR'}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </div>

        {output && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-teal-400">Generated ADR</h2>
              <button
                onClick={copyOutput}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
