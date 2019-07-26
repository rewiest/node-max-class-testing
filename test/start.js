const expect = require('chai').expect;

// these unit tests do not really test the actual code but are an example of the code pattern used

describe('Dummy Unit Tests', function () {

  it('should add numbers correctly', function() {
    const num1 = 2;
    const num2 = 3;
    expect(num1 + num2).to.equal(5);
  });
  
  it('should not give a result of 6', function() {
    const num1 = 2;
    const num2 = 3;
    expect(num1 + num2).not.to.equal(6);
  });

});
