const fs = require('fs');

fs.symlink('./real', './sym', 'dir', (e) => {
  console.info(e);
});
