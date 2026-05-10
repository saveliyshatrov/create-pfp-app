#!/usr/bin/env node

import pc from "picocolors";
import prompts from "prompts";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const REPO_URL = "https://github.com/savshatrov/Project.git";

const defaultName = "my-app";

const createFinalText = (projectName) => {
  return `
open /${projectName}:
  cd ${projectName}

Run to install all dependencies
  pnpm run prepare-dev

Run dev-build:
  pnpm run dev

Run prod-build:
  pnpm run build
  pnpm run start
`;
};

async function main() {
  console.log(pc.cyan("🚀 create-pfp-app\n"));

  const response = await prompts({
    type: "text",
    name: "projectName",
    message: "Project name:",
    initial: defaultName,
  });

  const projectName = (
    response.projectName?.trim() || defaultName
  ).toLowerCase();
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(pc.red(`Folder ${projectName} exists!`));
    process.exit(1);
  }

  console.log(pc.yellow(`\nCreating... ./${projectName}...`));

  execSync(`git clone ${REPO_URL} ${projectName}`, { stdio: "inherit" });

  const fullPath = path.join(process.cwd(), projectName);

  fs.rmSync(path.join(fullPath, ".git"), { recursive: true, force: true });

  console.log(pc.green("✅ Copied!"));

  console.log("\n" + pc.bold(pc.green("Done! 🎉")));
  console.log("\n" + pc.bold(pc.yellow(`Don't forget to install pnpm!`)));
  console.log("\n" + pc.green(`https://pnpm.io/installation`));
  console.log(pc.cyan(createFinalText(projectName)));
}

main().catch(console.error);
