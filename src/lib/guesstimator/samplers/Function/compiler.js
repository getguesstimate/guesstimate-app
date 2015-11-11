import math from 'mathjs';

const shorten = (str) => { return str.substring(1, str.length); };
export function compile(functionInput){
  const shortened = shorten(functionInput);
  const compiled = math.compile(shortened)
  return {compiled}
}
