//import {_sample} from './index.js';
//import {expect} from 'chai';

//describe('guesstimate', () => {
  //describe('#sample', () => {
    //let guesstimate = {foo: 'bar'}

    //it('works', () => {
      //expect(_sample(guesstimate, {}, 1)).to.deep.equal([5]);
    //});
  //});

  //describe('#guesstimateType', () => {
    //[
      //[{input: '=3'}, 'function'],
      //[{input: '3'}, 'distribution'],
      //[{max: '3', min: '8'}, 'distribution'],
      //[{input: 'iiii'}, 'unparseable'],
      //[{foo: '3', bar: '8'}, 'unparseable'],
    //]
    //it('works', () => {
      //let guesstimate = {input: '=3'}
      //expect(_sample(guesstimate, {}, 1)).to.deep.equal([5]);
    //});
  //});
//});

//describe('distribution', () => {

  //describe('#sample', () => {
      //[{input: '3'}, [3]],
      //[{distributionType: 'PointDistribution', value: 4}, [4]],
  //})

  //describe('#isA', () => {
    //[
      //[{input: '3'}, true],
      //[{input: '3->8'}, true],
      //[{distributionType: 'normalDistribution', low: '3', high: '8'}, true],
      //[{foo: '3', bar: '8'}, false],
      //[{input: ''}, false],
    //]
  //})

  //describe('#distributionType', () => {
    //[
      //[{input: '3'}, 'pointDistribution'],
      //[{input: '3->8'}, 'normalDistribution'],
      //[{distributionType: 'normalDistribution', low: '3', high: '8'}, 'normalDistribution'],
      //[{foo: '3', bar: '8'}, 'unparseable'],
      //[{low: '3', high: '8'}, 'unparseable'],
    //]

    //it('works', () => {
      //let guesstimate = {input: '=3'}
      //expect(_sample(guesstimate, {}, 1)).to.deep.equal([5]);
    //});
  //});
//});
