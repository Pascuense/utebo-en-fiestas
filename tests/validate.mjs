import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const events = JSON.parse(read('data/events.json'));
const announcements = JSON.parse(read('data/announcements.json'));

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(events.length === 80, `Se esperaban 80 actividades y se encontraron ${events.length}.`);
check(new Set(events.map(event => event.id)).size === events.length, 'Hay identificadores de actividad duplicados.');
check(events.every(event => /^2026-07-\d{2}$/.test(event.date)), 'Hay fechas fuera del formato YYYY-MM-DD.');
check(events.every(event => /^\d{2}:\d{2}$/.test(event.start)), 'Hay horas de inicio inválidas.');
check(events.every(event => typeof event.timeTbd === 'boolean'), 'Todas las actividades deben declarar timeTbd como booleano.');
const untimedEvents = events.filter(event => event.timeTbd);
check(untimedEvents.length === 1 && untimedEvents[0].id === 'e80', 'Solo e80 debe figurar con horario no indicado según el folleto.');
check(untimedEvents.every(event => event.start === '00:00' && !event.end), 'Las actividades sin horario deben usar 00:00 solo como valor técnico y no tener hora final.');
check(events.every(event => event.title && event.location && event.category), 'Hay actividades sin título, lugar o categoría.');
check(Array.isArray(announcements), 'Los avisos no forman una lista válida.');

for (const file of ['index.html', 'admin.html', 'assets/app.js', 'assets/admin.js', 'assets/styles.css', 'service-worker.js', 'manifest.webmanifest']) {
  check(fs.existsSync(path.join(root, file)), `Falta el archivo ${file}.`);
}

const config = read('config.js');
check(!/service[_-]?role/i.test(config), 'config.js no debe contener una clave service_role.');

if (failures.length) {
  console.error(failures.map(item => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log(`Validación correcta: ${events.length} actividades, ${announcements.length} avisos y archivos esenciales presentes.`);
