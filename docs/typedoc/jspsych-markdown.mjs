// @ts-check
/**
 * Local typedoc-plugin-markdown plugin that rewrites the generated Markdown into
 * jsPsych's documentation voice, tuned for a dual audience: researchers who are
 * not TypeScript developers, and developers who want exact types.
 *
 * Per function it produces a "lead approachable, keep the rigor" layout:
 *   1. A copy-pasteable namespaced call signature (`jsPsych.utils.unique(arr)`).
 *   2. The plain-language description.
 *   3. The runnable Example, given prominence right under the description.
 *   4. A slimmed Parameters table (name + description only) and a prose Returns.
 *   5. A collapsed <details> block holding the precise TypeScript signature,
 *      type parameters, parameter types, return type, and source link — so the
 *      technical specs take zero space until a developer wants them.
 */
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

/** Maps a TypeDoc module name (source file basename) to its public namespace. */
const NAMESPACES = {
  utils: "jsPsych.utils",
  randomization: "jsPsych.randomization",
  turk: "jsPsych.turk",
  data: "jsPsych.data",
  pluginAPI: "jsPsych.pluginAPI",
};

/** Trim leading/trailing blank lines from an array of lines. */
function trimBlankLines(lines) {
  let a = 0;
  let b = lines.length;
  while (a < b && lines[a].trim() === "") a++;
  while (b > a && lines[b - 1].trim() === "") b--;
  return lines.slice(a, b);
}

/** Parse a Markdown pipe-table (header + separator + rows) into cell arrays. */
function parseTable(lines) {
  const rows = lines.filter((l) => l.trim().startsWith("|"));
  return rows
    .slice(2) // drop header + separator
    .map((r) =>
      r
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim()),
    );
}

/**
 * Split one function block (the lines after a `## name()` heading) into its
 * constituent parts.
 */
function parseFunctionBlock(lines) {
  let tsSig = "";
  let definedIn = "";
  const descLines = [];
  /** @type {Record<string, string[]>} */
  const sections = {};

  let cur = "_pre";
  let inFence = false;
  let fenceLang = "";
  let fenceBuf = [];

  for (const line of lines) {
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceLang = fence[1];
        fenceBuf = [];
      } else {
        inFence = false;
        if (cur === "_pre" && fenceLang === "ts" && !tsSig) {
          tsSig = fenceBuf.join("\n");
        } else {
          const target = cur === "_pre" ? descLines : sections[cur];
          target.push("```" + fenceLang, ...fenceBuf, "```");
        }
      }
      continue;
    }
    if (inFence) {
      fenceBuf.push(line);
      continue;
    }
    const heading = line.match(/^### (.+?)\s*$/);
    if (heading) {
      cur = heading[1];
      sections[cur] = sections[cur] || [];
      continue;
    }
    if (cur === "_pre") {
      if (/^Defined in:/.test(line)) definedIn = line;
      else descLines.push(line);
    } else {
      sections[cur].push(line);
    }
  }

  return { tsSig, definedIn, descLines, sections };
}

/** Render a single function in the jsPsych dual-audience layout. */
function renderFunction(name, blockLines, ns) {
  const { tsSig, definedIn, descLines, sections } = parseFunctionBlock(blockLines);

  // Call signature: namespaced, generics + return type stripped.
  const argsMatch = tsSig.match(/^function\s+\w+(?:<[^>]*>)?\(([^)]*)\)/);
  const callArgs = argsMatch ? argsMatch[1] : "";

  const out = [];
  out.push(`## ${ns}.${name}()`, "");
  out.push("```js", `${ns}.${name}(${callArgs})`, "```", "");

  const description = trimBlankLines(descLines);
  if (description.length) out.push(...description, "");

  // Example leads, given prominence right under the description.
  if (sections["Example"]) {
    out.push("### Example", "", ...trimBlankLines(sections["Example"]), "");
  }

  // Slimmed Parameters table: name + description only.
  const paramRows = sections["Parameters"] ? parseTable(sections["Parameters"]) : [];
  if (paramRows.length) {
    out.push("### Parameters", "");
    out.push("| Parameter | Description |", "| ------ | ------ |");
    for (const cells of paramRows) {
      const pName = cells[0] || "";
      const pDesc = cells[2] || "";
      out.push(`| ${pName} | ${pDesc} |`);
    }
    out.push("");
  }

  // Returns: prose only (the type lives in the details block).
  let returnType = "";
  if (sections["Returns"]) {
    const r = trimBlankLines(sections["Returns"]);
    if (r.length) {
      returnType = r[0].trim();
      const prose = trimBlankLines(r.slice(1));
      if (prose.length) out.push("### Returns", "", ...prose, "");
    }
  }

  // Collapsed technical specs.
  const details = [];
  if (tsSig) {
    details.push("```ts", tsSig.replace(/;\s*$/, ""), "```", "");
  }
  const typeParamRows = sections["Type Parameters"] ? parseTable(sections["Type Parameters"]) : [];
  if (typeParamRows.length) {
    details.push("**Type parameters**", "");
    for (const cells of typeParamRows) {
      details.push(
        cells.length >= 3
          ? `- ${cells[0]} (${cells[1]}) — ${cells[2]}`
          : `- ${cells[0]} — ${cells[1] || ""}`,
      );
    }
    details.push("");
  }
  if (paramRows.length) {
    details.push("**Parameter types**", "");
    for (const cells of paramRows) details.push(`- ${cells[0]}: ${cells[1] || ""}`);
    details.push("");
  }
  if (returnType) details.push(`**Returns:** ${returnType}`, "");
  if (definedIn) details.push(definedIn, "");

  if (details.length) {
    out.push(
      '<details className="api-types">',
      "<summary>TypeScript signature and types</summary>",
      "",
      ...trimBlankLines(details),
      "",
      "</details>",
      "",
    );
  }

  return out;
}

/**
 * @param {string} markdown
 * @param {string} ns  e.g. "jsPsych.utils"
 */
export function applyJsPsychVoice(markdown, ns) {
  const lines = markdown.replace(/\n\*\*\*\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  // Head: page title (rename to namespace) + module description.
  while (i < lines.length && !lines[i].startsWith("## ")) {
    out.push(/^# .+/.test(lines[i]) ? `# ${ns}` : lines[i]);
    i++;
  }

  // Function blocks.
  while (i < lines.length) {
    const heading = lines[i].match(/^## (\w+)\(\)\s*$/);
    i++;
    const block = [];
    while (i < lines.length && !lines[i].startsWith("## ")) {
      block.push(lines[i]);
      i++;
    }
    if (heading) out.push(...renderFunction(heading[1], block, ns));
    else out.push(lines[i - 1 - block.length], ...block);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

/** @param {import("typedoc").Application} app */
export function load(app) {
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    const moduleName = page.model && page.model.name;
    const ns = NAMESPACES[moduleName];
    if (!ns || typeof page.contents !== "string") return;
    page.contents = applyJsPsychVoice(page.contents, ns);
  });
}
