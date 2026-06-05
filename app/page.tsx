type Layer = {
  n: number;
  name: string;
  wiredAs: string;
};

const LAYERS: readonly Layer[] = [
  { n: 1, name: "Process & policy", wiredAs: "REVIEW.md · CLAUDE.md · AGENTS.md · branch protection (docs)" },
  { n: 2, name: "Static analyzers", wiredAs: "eslint.config.mjs · semgrep.yml · npm audit" },
  { n: 3, name: "Local AI agents + hooks", wiredAs: ".cursor/hooks.json · .claude/ · security subagent · consolidate-review" },
  { n: 4, name: "PR bots", wiredAs: ".coderabbit.yaml · .github/copilot-instructions.md" },
  { n: 5, name: "Cloud agent fleets", wiredAs: "/code-review ultra · Cursor BugBot (docs/process.md)" },
];

type Endpoint = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  auth: string;
};

const ENDPOINTS: readonly Endpoint[] = [
  { method: "GET", path: "/api/health", auth: "public" },
  { method: "GET", path: "/api/notes", auth: "session" },
  { method: "POST", path: "/api/notes", auth: "session" },
  { method: "GET", path: "/api/notes/[id]", auth: "owner" },
  { method: "PATCH", path: "/api/notes/[id]", auth: "owner" },
  { method: "DELETE", path: "/api/notes/[id]", auth: "owner" },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm font-mono uppercase tracking-widest text-emerald-400">
        Day 7 · reference
      </p>
      <h1 className="mt-2 text-3xl font-bold">Code Review with AI</h1>
      <p className="mt-3 text-neutral-400">
        A clean Next.js app where every layer of the review pyramid is wired and
        runnable. Use it as the code under review for the workshop exercises.
      </p>

      <h2 className="mt-10 text-lg font-semibold">The 5-layer review stack</h2>
      <ul className="mt-3 space-y-2">
        {LAYERS.map((l) => (
          <li
            key={l.n}
            className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3"
          >
            <span className="font-mono text-emerald-400">L{l.n}</span>{" "}
            <span className="font-medium">{l.name}</span>
            <div className="mt-1 text-sm text-neutral-500">{l.wiredAs}</div>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-semibold">Endpoints under review</h2>
      <table className="mt-3 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-400">
            <th className="py-2 pr-4 font-medium">Method</th>
            <th className="py-2 pr-4 font-medium">Path</th>
            <th className="py-2 font-medium">Auth</th>
          </tr>
        </thead>
        <tbody>
          {ENDPOINTS.map((e) => (
            <tr key={`${e.method} ${e.path}`} className="border-b border-neutral-900">
              <td className="py-2 pr-4 font-mono text-emerald-400">{e.method}</td>
              <td className="py-2 pr-4 font-mono">{e.path}</td>
              <td className="py-2 text-neutral-400">{e.auth}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-10 text-sm text-neutral-500">
        Start with <span className="font-mono text-neutral-300">README.md</span>{" "}
        and <span className="font-mono text-neutral-300">REVIEW.md</span>. The
        assignment lives in{" "}
        <span className="font-mono text-neutral-300">docs/assignment.md</span>.
      </p>
    </main>
  );
}
