const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const rootHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const legacyHtml = fs.readFileSync(path.join(__dirname, '..', 'legacy.html'), 'utf8');

test('the redesign is the default app and the previous standalone UI remains available', () => {
  assert.match(rootHtml, /<div id="root"><\/div>/);
  assert.match(rootHtml, /src="\/src\/main\.tsx"/);
  assert.match(legacyHtml, /id="campaign-root"/);
  assert.match(legacyHtml, /src="campaign\.js"/);
});
