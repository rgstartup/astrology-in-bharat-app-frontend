const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (dir.includes('node_modules') || dir.includes('.git')) return results;
  try {
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          try {
            let content = fs.readFileSync(file, 'utf8');
            if (content.includes('❓ Frequently Asked Questions')) {
              let lines = content.split('\n');
              let modified = false;
              for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('❓ Frequently Asked Questions')) {
                  if (i > 0 && lines[i-1].includes('inline-block')) {
                    if (!lines[i-1].includes('whitespace-nowrap')) {
                      lines[i-1] = lines[i-1].replace('inline-block', 'inline-block whitespace-nowrap').replace('text-[20px]', 'text-[18px] sm:text-[20px]');
                      modified = true;
                    }
                  }
                }
              }
              if (modified) {
                fs.writeFileSync(file, lines.join('\n'));
                results.push(file);
              }
            }
          } catch (e) {}
        }
      }
    });
  } catch (e) {}
  return results;
}

console.log('Modified files:', walk('D:/ravi/astrology-in-bharat-app-frontend/apps/main/src/app'));
