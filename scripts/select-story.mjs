import fs from "fs";
import path from "path";

const projectDir = process.cwd();

/* --------------------------------------------------
   READ .env.local IF IT EXISTS
-------------------------------------------------- */

const envLocalPath = path.join(
  projectDir,
  ".env.local"
);

if (fs.existsSync(envLocalPath)) {
  const envFile = fs.readFileSync(
    envLocalPath,
    "utf8"
  );

  envFile
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();

      // ignore empty lines + comments
      if (
        !trimmed ||
        trimmed.startsWith("#")
      ) {
        return;
      }

      const separatorIndex =
        trimmed.indexOf("=");

      if (separatorIndex === -1) {
        return;
      }

      const key = trimmed
        .slice(0, separatorIndex)
        .trim();

      let value = trimmed
        .slice(separatorIndex + 1)
        .trim();

      // remove optional quotes
      if (
        (value.startsWith('"') &&
          value.endsWith('"')) ||
        (value.startsWith("'") &&
          value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
}

/* --------------------------------------------------
   SELECT STORY MODE
-------------------------------------------------- */

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

/* --------------------------------------------------
   VALIDATE PLACEHOLDER
-------------------------------------------------- */

if (!fs.existsSync(placeholderFile)) {
  console.error(
    "✗ story.placeholder.ts not found."
  );

  process.exit(1);
}

/* --------------------------------------------------
   CHOOSE SOURCE
-------------------------------------------------- */

let sourceFile = placeholderFile;

if (mode === "private") {
  if (fs.existsSync(privateFile)) {
    sourceFile = privateFile;

    console.log(
      "✓ Private story content selected."
    );
  } else {
    console.warn(
      "⚠ STORY_MODE=private but story.private.ts was not found."
    );

    console.warn(
      "⚠ Falling back to placeholder content."
    );
  }
} else {
  console.log(
    "✓ Placeholder story content selected."
  );
}

/* --------------------------------------------------
   GENERATE ACTIVE STORY FILE
-------------------------------------------------- */

fs.copyFileSync(
  sourceFile,
  generatedFile
);

console.log(
  `✓ Generated: content/story.generated.ts`
);

console.log(
  `✓ Story mode: ${
    sourceFile === privateFile
      ? "private"
      : "placeholder"
  }`
);