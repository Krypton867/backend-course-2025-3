import { Command } from 'commander';
import fs from 'fs';

const program = new Command();

program
  .option('-i, --input <path>', 'input file path (required)')
  .option('-o, --output <path>', 'output file path (optional)')
  .option('-d, --display', 'display result in console');

program.parse(process.argv);
const options = program.opts();

// --- 1. Перевірка наявності обов’язкового параметра ---
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

// --- 2. Перевірка існування файлу ---
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// --- 3. Читаємо JSON/JSONL файл ---
const rawData = fs.readFileSync(options.input, 'utf-8');
const lines = rawData.split('\n').filter(line => line.trim() !== '');

let data;
try {
  data = lines.map(line => JSON.parse(line));
} catch (error) {
  console.error("Error parsing JSON:", error.message);
  process.exit(1);
}

// --- 4. Формуємо результат ---
const result = JSON.stringify(data, null, 2);

// --- 5. Вивід у консоль ---
if (options.display) {
  console.log(result);
}

// --- 6. Запис у файл ---
if (options.output) {
  try {
    fs.writeFileSync(options.output, result);
    console.log(`✅ Result saved to ${options.output}`);
  } catch (err) {
    console.error("Error writing to file:", err.message);
  }
}
