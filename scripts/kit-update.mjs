/**
 * Пересобирает tgz дизайн-системы из соседнего репозитория кита и
 * переустанавливает его в прототип. Ветка кита не создаётся, репозиторий
 * кита не меняется: `npm pack` берёт только уже собранный `dist/`.
 *
 *   npm run kit:update            — упаковать текущий dist/ кита
 *   npm run kit:update -- --build — сначала `npm run build` в ките (долго)
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(path.join(projectRoot, "package.json"), "utf8"));
const kitDir = path.resolve(projectRoot, pkg.config.kitDir);
const vendorDir = path.join(projectRoot, "vendor");
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: "inherit" });

if (process.argv.includes("--build")) {
  run("npm run build", kitDir);
}

for (const file of readdirSync(vendorDir)) {
  if (file.endsWith(".tgz")) rmSync(path.join(vendorDir, file));
}
run(`npm pack --pack-destination "${vendorDir}"`, kitDir);

const tgz = readdirSync(vendorDir).find((file) => file.endsWith(".tgz"));
if (!tgz) throw new Error("npm pack не создал tgz в vendor/");
if (pkg.dependencies["@otp/space-ui-kit"] !== `file:vendor/${tgz}`) {
  console.warn(`В package.json указан другой файл кита — обнови на file:vendor/${tgz}`);
}
// Переустановка именно этого пакета, чтобы npm не взял старый кеш.
rmSync(path.join(projectRoot, "node_modules", "@otp", "space-ui-kit"), { recursive: true, force: true });
run(`npm install "./vendor/${tgz}"`, projectRoot);
console.log(`Кит обновлён: vendor/${tgz}`);
