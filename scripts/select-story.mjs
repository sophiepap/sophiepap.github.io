import fs from "fs";
import path from "path";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();

loadEnvConfig(projectDir);

const mode =
  process.env.STORY_MODE === "private"
    ? "private"
    : "placeholder";

const contentDir = path.join(
  projectDir,
  "content"
);

const placeholderFile = path.join(
  contentDir,
  "story.placeholder.ts"
);

const privateFile = path.join(
  contentDir,
  "story.private.ts"
);

const generatedFile = path.join(
  contentDir,
  "story.generated.ts"
);

let sourceFile = placeholderFile;

if (mode === "private") {
  if (fs.existsSync(privateFile)) {
    sourceFile = privateFile;
  } else {
    console.warn(
      "⚠ story.private.ts not found. Using placeholder content."
    );
  }
}

fs.copyFileSync(
  sourceFile,
  generatedFile
);

console.log(
  `✓ Story mode: ${mode}`
);