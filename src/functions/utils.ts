import * as fs from 'fs';
import * as path from 'path';

export default {
    getRecursiveFiles(dir: string): string[] | null {
        if (!fs.existsSync(dir)) return null;
    
        const dirents = fs.readdirSync(dir, { withFileTypes: true });
        const files = dirents.map(dirent => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? this.getRecursiveFiles(res) : res;
        });
    
        return Array.prototype.concat(...files) as string[];
    }
}