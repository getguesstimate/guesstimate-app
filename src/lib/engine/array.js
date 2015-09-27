export function *cycle(items) {
  let index = -1;
  while(true) {
    index = (index + 1) % items.length;
    yield items[index];
  }
}

