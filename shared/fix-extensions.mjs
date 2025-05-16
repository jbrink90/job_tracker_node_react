import fs from 'fs/promises';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function fixExtensions(dir) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await fixExtensions(fullPath);
    } else if (file.endsWith('.js')) {
      let content = await fs.readFile(fullPath, 'utf-8');
      content = content.replace(
        /((import|export).*from\s+['"])(\.\/[^'"]+)(['"])/g,
        (match, p1, p2, p3, p4) => {
          if (!p3.endsWith('.js') && !p3.endsWith('.json')) {
            return `${p1}${p3}.js${p4}`;
          }
          return match;
        }
      );
      await fs.writeFile(fullPath, content);
    }
  }
}

fixExtensions(path.resolve(__dirname, 'dist'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
