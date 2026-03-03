import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_FILE = path.join(__dirname, 'chart-data.json');
const TYPE_FILE = path.join(__dirname, 'chart-type.json');

function init() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([
            { name: 'A', value: 100 },
            { name: 'B', value: 200 },
            { name: 'C', value: 150 }
        ], null, 2));
    }
    if (!fs.existsSync(TYPE_FILE)) {
        fs.writeFileSync(TYPE_FILE, JSON.stringify({ type: 'pie' }, null, 2));
    }
}

function processCommand(cmd) {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();

    switch(command) {
        case 'do':
            const typeNum = parseInt(parts[1]);
            const types = { 1: 'bar', 2: 'pie', 3: 'line' };
            if (types[typeNum]) {
                fs.writeFileSync(TYPE_FILE, JSON.stringify({ type: types[typeNum] }, null, 2));
                console.log(`✅ Тип: ${types[typeNum]}`);
            }
            break;

        case 'add':
            const [val, name] = parts[1].split('-');
            const data = JSON.parse(fs.readFileSync(DATA_FILE));
            const existing = data.findIndex(d => d.name === name);
            if (existing >= 0) data[existing].value = parseInt(val);
            else data.push({ name, value: parseInt(val) });
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            console.log(`✅ Добавлено: ${name} = ${val}`);
            break;

        case 'del':
            const delName = parts[1];
            const current = JSON.parse(fs.readFileSync(DATA_FILE));
            const filtered = current.filter(d => d.name !== delName);
            fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
            console.log(`✅ Удалено: ${delName}`);
            break;

        case 'list':
            const all = JSON.parse(fs.readFileSync(DATA_FILE));
            console.log('\n📊 Данные:');
            all.forEach(d => console.log(`   ${d.name}: ${d.value}`));
            break;

        case 'clear':
            fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
            console.log('✅ Данные очищены');
            break;

        case 'help':
            console.log('\n📚 Команды:');
            console.log('  do 1|2|3     - bar|pie|line');
            console.log('  add 100-Имя  - добавить');
            console.log('  del Имя      - удалить');
            console.log('  list         - список');
            console.log('  clear        - очистить всё');
            console.log('  exit         - выход\n');
            break;

        case 'exit':
            process.exit();
    }
}

init();
console.log('\n🔧 Chart Console Manager');
console.log('Команда: help\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

rl.prompt();
rl.on('line', (line) => {
    processCommand(line);
    rl.prompt();
});