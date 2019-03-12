process.nextTick(() => {
  console.log('tick');
});

setTimeout(() => {
  console.log('timeout');
}, 1000);

console.log('now');
