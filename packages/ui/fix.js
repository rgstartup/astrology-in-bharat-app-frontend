const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/: any\b/g, ': unknown');
    newContent = newContent.replace(/@ts-ignore/g, '@ts-expect-error');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Fixed:', filePath);
    }
  }
});
