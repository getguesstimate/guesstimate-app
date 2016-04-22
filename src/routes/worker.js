import math from 'mathjs'

onmessage = function(event) {
  let i = 0
  let f = 3
  while (i < 100000000) {
    const foo = _.some([3,4,5,3], e => {true})
    const mean = math.mean(3,10)
    i = i + 1;
    (i % 10000000 == 0) && postMessage(`foo, ${foo}, ${i}, ${mean}`);
  }
  postMessage('done')
}
