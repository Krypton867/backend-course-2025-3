import { Command } from 'commander';
import fs from 'fs';

const program = new Command();

program
  .option('-i, --input <path>', 'input file path (required)')
  .option('-o, --output <path>', 'output file path (optional)')
  .option('-d, --display', 'display result in console')
  .option('-v, --variety', 'include variety in output')
  .option('-l, --length <number>', 'filter by petal.length > number', parseFloat);

program.parse(process.argv);
const options = program.opts();

// --- 1. Перевірка обовʼязкового параметра ---
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

// --- 2. Перевірка існування файлу ---
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// --- 3. Читаємо JSONL або JSON ---
const rawData = fs.readFileSync(options.input, 'utf-8');
const lines = rawData.split('\n').filter(line => line.trim() !== '');

let data;
try {
  data = lines.map(line => JSON.parse(line));
} catch (error) {
  console.error("Error parsing JSON:", error.message);
  process.exit(1);
}

// --- 4. Фільтрація та форматування ---
const filtered = data
  .filter(item => !options.length || item["petal.length"] > options.length)
  .map(item => {
    let output = `${item["petal.length"]} ${item["petal.width"]}`;
    if (options.variety) output += ` ${item["variety"]}`;
    return output;
  });

// --- 5. Вивід ---
if (options.display) {
  filtered.forEach(line => console.log(line));
}

// --- 6. Запис у файл ---
if (options.output) {
  try {
    fs.writeFileSync(options.output, filtered.join('\n'));
    console.log(`✅ Result saved to ${options.output}`);
  } catch (err) {
    console.error("Error writing to file:", err.message);
  }
}
