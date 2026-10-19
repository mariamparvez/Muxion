import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'muxion');
const output = path.join(root, 'public');
await fs.mkdir(output, {recursive: true});
for (const name of ['index.html', 'app.js', 'data.js', 'enhancements.js', 'razorpay-checkout.js', 'styles.css', 'polish.css', 'imagery.css', 'readability.css', 'buttons.css']) {
  await fs.copyFile(path.join(source, name), path.join(output, name));
}
await fs.cp(path.join(source, 'assets'), path.join(output, 'assets'), {recursive: true});
console.log('Built MUXION preview. Private backend files are excluded.');
