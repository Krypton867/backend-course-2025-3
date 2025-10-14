import { Command } from 'commander';

const program = new Command();

program
  .name('backend-course-2025-3')
  .description('CLI програма для читання аргументів')
  .version('1.0.0');

program
  .option('-n, --name <string>', 'твоє імʼя')
  .option('-a, --age <number>', 'твій вік');

program.parse(process.argv);

const options = program.opts();

console.log("Отримані аргументи:", options);
