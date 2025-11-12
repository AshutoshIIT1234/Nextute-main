// Script to update version.json before build
import { writeFileSync } from 'fs';
import { join } from 'path';

const version = {
  version: new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5),
  buildTime: new Date().toISOString(),
  timestamp: Date.now()
};

const versionPath = join(process.cwd(), 'public', 'version.json');
writeFileSync(versionPath, JSON.stringify(version, null, 2));

console.log('✅ Version updated:', version.version);
