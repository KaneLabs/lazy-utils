const {
  // calcFeeTotal,
  // calcSubTotal,
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
    expect(calcTaxAmount('8.99', 290)).to.deep.equal(27);
    expect(calcTaxAmount('8.99', '2.90')).to.deep.equal(27);
  });
});

describe('calcTaxTotal(cart)', () => {
  it('should return the correct tax total for string price inputs', () => {
    expect(calcTaxTotal(stringPriceCart)).to.deep.equal(108);
  });

  it('should return the correct tax total for integer price inputs', () => {
    expect(calcTaxTotal(intPriceChart)).to.deep.equal(108);
  });
});
