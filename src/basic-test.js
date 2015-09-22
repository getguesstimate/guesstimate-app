var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils'); //I like using the Test Utils, but you can just use the DOM API instead.
var expect = require('expect');

describe('root', function () {
  it('renders without problems', function () {
    expect(3).toExist();
  });
});
