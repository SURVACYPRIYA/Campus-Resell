const fs = require('fs');
const path = require('path');

const dirToProcess = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = false;

      // Special cases for string matching
      if (content.includes('alert(') && !content.includes('ShieldAlert')) {
        // we might have ShieldAlert, we should be careful. We only want alert(' or alert(" or alert(variable
        const alertRegex = /\balert\s*\(/g;
        
        let match;
        let requiresImport = false;
        
        const newContent = content.replace(alertRegex, (match, offset) => {
          // Check if it's an error alert
          // Very rudimentary heuristic: if it contains 'failed', 'error', or 'err.response'
          // We look ahead to see what's inside the alert
          const afterAlert = content.substring(offset, offset + 150);
          if (afterAlert.toLowerCase().includes('failed') || 
              afterAlert.toLowerCase().includes('error') || 
              afterAlert.includes('err.response')) {
            requiresImport = true;
            return 'toast.error(';
          } else if (afterAlert.toLowerCase().includes('success') ||
                     afterAlert.toLowerCase().includes('copied') ||
                     afterAlert.toLowerCase().includes('thank you') ||
                     afterAlert.toLowerCase().includes('sent')) {
            requiresImport = true;
            return 'toast.success(';
          } else {
             requiresImport = true;
             return 'toast(';
          }
        });

        if (requiresImport) {
          if (!newContent.includes("import toast")) {
             // add import after first import
             content = newContent.replace(/import React(.*?);\n/, "import React$1;\nimport toast from 'react-hot-toast';\n");
             if (content === newContent) {
                // if no React import, just prepend
                content = "import toast from 'react-hot-toast';\n" + newContent;
             }
          } else {
             content = newContent;
          }
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
      }
    }
  }
}

for (const dir of dirToProcess) {
  processDirectory(dir);
}
console.log('Done.');
