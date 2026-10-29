const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

console.log(chalk.green("Hello from the layers demo !"));
console.log(chalk.yellow("Try changing this message and rebuilding."));
console.log(chalk.cyan("Notice how npm install is CACHED (fast rebuild)."));

// Show that we're running as non-root
const os = require("os");
console.log(chalk.magenta(`Running as user: ${os.userInfo().username} (uid: ${os.userInfo().uid})`));

// Write a log entry to /app/logs (volume mount point)
const logFile = path.join("/app/logs", "app.log");
const entry = `[${new Date().toISOString()}] App started as ${os.userInfo().username}\n`;

try {
  fs.appendFileSync(logFile, entry);
  const logs = fs.readFileSync(logFile, "utf-8");
  const lineCount = logs.trim().split("\n").length;
  console.log(chalk.blue(`Log written to ${logFile} (${lineCount} entries total)`));
} catch (err) {
  console.log(chalk.red(`Could not write to ${logFile}: ${err.message}`));
  console.log(chalk.red("Did you mount a volume? Try: docker run --rm -v demo-logs:/app/logs layers-demo"));
}
