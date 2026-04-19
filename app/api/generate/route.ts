import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { context, decision, options } = await req.json();
    if (!context?.trim()) {
      return NextResponse.json({ error: 'Decision context is required' }, { status: 400 });
    }

    const systemPrompt = `Generate a complete ADR (Architecture Decision Record) in MADR format. Include:
# ADR-[N]: [Title]
## Status (Proposed | Accepted | Deprecated)
## Context (forces, constraints, problem)
## Decision Drivers
## Options Considered
${options || ''}
## Decision Outcome
${decision ? 'Chosen: ' + decision : '(please recommend)'}
## Consequences (Positive / Negative / Neutral)
## Related ADRs
## Notes
Be architectural and thorough.`;

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context:\n${context}` },
        ],
        temperature: 0.6,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `DeepSeek API error: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    const output = data.choices?.[0]?.message?.content || 'No output generated.';
    return NextResponse.json({ output });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
