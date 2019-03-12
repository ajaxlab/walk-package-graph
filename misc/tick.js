const fs = require('fs');

fs.readdir('./node_modules', (e, files) => {
  process.nextTick(() => {
    console.log('tick');
  });
  console.log(files.length);
});

console.log('now');
