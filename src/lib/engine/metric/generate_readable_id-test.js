import {generateReadableId} from './generate_readable_id.js';
import {expect} from 'chai';

describe('#generateReadableId', () => {
  let result = null;

  it('works with one word', () => {
    result = generateReadableId('People', []);
    expect(result).to.equal('PEOP');
  });

  it('works with two words', () => {
    result = generateReadableId('People in', []);
    expect(result).to.equal('PEOP');
  });

  it('works with three words', () => {
    result = generateReadableId('People in New York', []);
    expect(result).to.equal('PINY');
  });

  it('works with three words and one duplicate', () => {
    result = generateReadableId('People in New York', ['PINY']);
    expect(result).to.equal('PINY1');
  });

  it('works with three words and two duplicates', () => {
    result = generateReadableId('People in New York', ['PINY', 'PINY1']);
    expect(result).to.equal('PINY2');
  });
});
