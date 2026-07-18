const test = require('node:test');
const assert = require('node:assert/strict');
const { runApp } = require('../src/app');

test('runApp returns the expected startup message', () => {
  assert.equal(runApp(), 'Capstone setup is running successfully.');
});
