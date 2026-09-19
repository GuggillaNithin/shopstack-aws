const fs = require('fs');
const path = require('path');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndReplace(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace single-quoted basic URLs: 'http://localhost:5000/api/...' -> `${process.env.NEXT_PUBLIC_API_URL}/api/...`
      content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');
      
      // Replace backtick basic URLs: `http://localhost:5000/api/...` -> `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/...`
      content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

findAndReplace(path.join(__dirname, 'src'));
console.log('Replaced all hardcoded URLs!');
