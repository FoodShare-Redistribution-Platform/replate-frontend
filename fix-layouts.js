import fs from 'fs';
import path from 'path';

const pagesDir = 'c:/Users/shrut/OneDrive/Documents/Amrita Notes/sem 6/SE_project/replate-frontend/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    let modified = false;

    if (content.includes("import DashboardLayout")) {
        content = content.replace(/import DashboardLayout.*?;\r?\n/, '');
        modified = true;
    }

    if (content.includes("<DashboardLayout")) {
        content = content.replace(/<DashboardLayout[^>]*>/g, '<>');
        content = content.replace(/<\/DashboardLayout>/g, '</>');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Modified ${file}`);
    }
}
