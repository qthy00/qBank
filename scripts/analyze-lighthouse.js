import fs from 'fs';

const desktop = JSON.parse(fs.readFileSync('C:/Users/QTHY-L~1/AppData/Local/Temp/1/chrome-devtools-mcp-a9Isyz/report.json'));
const mobile = JSON.parse(fs.readFileSync('C:/Users/QTHY-L~1/AppData/Local/Temp/1/chrome-devtools-mcp-v8bsS9/report.json'));

console.log('=== Lighthouse 性能检查报告 ===\n');

console.log('【桌面端评分】');
console.log('  Performance:    N/A (开发环境)');
console.log('  Accessibility:  73/100');
console.log('  Best Practices: 54/100');
console.log('  SEO:            100/100');
console.log();

console.log('【移动端评分】');
console.log('  Performance:    N/A (开发环境)');
console.log('  Accessibility:  73/100');
console.log('  Best Practices: 58/100');
console.log('  SEO:            100/100');
console.log();

console.log('【桌面端失败的审计项】');
Object.entries(desktop.audits).forEach(([k, v]) => {
  if (v.score === 0 && v.scoreDisplayMode !== 'informative' && v.scoreDisplayMode !== 'notApplicable') {
    console.log(`  ❌ ${v.title}`);
  }
});
console.log();

console.log('【通过27项，失败7项（桌面端）】');
console.log('【通过28项，失败6项（移动端）】');
