const {
  calcCartAmount,
  calcFeeAmount,
  calcSubTotal,
  calcTaxAmount,
  calcTaxTotal,
  // checkCartToTellIfThisStoresAgeRestriced,
  // checkCartForStoreIds,
  // checkCartForSubTotal,
  // checkCartForTaxTotal,
  // checkCartForFeeTotal,
  // is18,
  // is21,
  normalizePrice,
  normalizeTax,
  // removeSpecialChars,
  // splitOrdersIntoStore,
  // validateEmail,
  // validateIsNumberAndPositve,
  // validateNumberPositiveOrZero,
} = require('../index');

const {
  describe, it,
} = require('mocha');

const { expect } = require('chai');

const stringPriceCart = require('./mock1.0Cart');
const intPriceChart = require('./mock2.0Cart');

describe('normalizePrice()', () => {
  it('should return base 100 price for string decimal input', () => {
    expect(normalizePrice('2.22')).to.deep.equal(222);
    expect(normalizePrice('2.99')).to.deep.equal(299);
    expect(normalizePrice('0.00')).to.deep.equal(0);
    expect(normalizePrice(-10)).to.deep.equal(0);
    expect(normalizePrice('-10.00')).to.deep.equal(0);
    expect(normalizePrice(NaN)).to.deep.equal(0);
    expect(normalizePrice(false)).to.deep.equal(0);
    expect(normalizePrice('five')).to.deep.equal(0);
  });

  it('should return base 100 price for integer input', () => {
    expect(normalizePrice(222)).to.deep.equal(222);
    expect(normalizePrice(299)).to.deep.equal(299);
    expect(normalizePrice('-10.00')).to.deep.equal(0);
    expect(normalizePrice(-10)).to.deep.equal(0);
    expect(normalizePrice(NaN)).to.deep.equal(0);
    expect(normalizePrice(false)).to.deep.equal(0);
    expect(normalizePrice('five')).to.deep.equal(0);
  });
});

describe('normalizeTax()', () => {
  it('should return clean decimal for string decimal input', () => {
    expect(normalizeTax('2.22')).to.deep.equal(0.0222);
    expect(normalizeTax('2.99')).to.deep.equal(0.0299);
    expect(normalizeTax('0.00')).to.deep.equal(0);
    expect(normalizeTax('-10.00')).to.deep.equal(0);
    expect(normalizeTax(NaN)).to.deep.equal(0);
    expect(normalizeTax(false)).to.deep.equal(0);
    expect(normalizeTax('five')).to.deep.equal(0);
  });
});

describe('calcTaxAmount(taxRate, itemPrice)', () => {
  it('should return the correct tax in base100 currency for API 1', () => {
    expect(calcTaxAmount('8.99', '3.00')).to.deep.equal(27);
  });

  it('should return the correct tax in base100 currency for API 2', () => {
    expect(calcTaxAmount('8.99', 300)).to.deep.equal(27);
  });

  it('should round up to nearest whole penny', () => {
    expect(calcTaxAmount('8.99', 899)).to.deep.equal(81);
    expect(calcTaxAmount('8.99', '8.99')).to.deep.equal(81);
  });
});

describe('calcTaxTotal(cart)', () => {
  it('should return the correct tax total for string price inputs', () => {
    expect(calcTaxTotal(stringPriceCart)).to.deep.equal(270);
  });

  it('should return the correct tax total for integer price inputs', () => {
    expect(calcTaxTotal(intPriceChart)).to.deep.equal(270);
  });
});


describe('calcSubTotal(cart)', () => {
  it('should return the correct sub total for string price inputs', () => {
    expect(calcSubTotal(stringPriceCart)).to.deep.equal(3597);
  });

  it('should return the correct sub total for integer price inputs', () => {
    expect(calcSubTotal(intPriceChart)).to.deep.equal(3597);
  });
});

describe('calcFeeAmount(cart)', () => {
  it('should return the correct sub total for string price inputs', () => {
    expect(calcFeeAmount(stringPriceCart)).to.deep.equal(550);
  });

  it('should return the correct sub total for integer price inputs', () => {
    expect(calcFeeAmount(intPriceChart)).to.deep.equal(550);
  });
});

describe('calcCartAmount(cart)', () => {
  it('should return the correct cart amount for string price inputs', () => {
    expect(calcCartAmount(stringPriceCart)).to.deep.equal(4417);
  });

  it('should return the correct cart amount for integer price inputs', () => {
    expect(calcCartAmount(intPriceChart)).to.deep.equal(4417);
  });
});
