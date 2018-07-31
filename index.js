const moment = require('moment-timezone');

const stylePhone = (num) => `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6, 10)}`;

const normalizePrice = (price) => {
  try {
    if (isNaN(parseFloat(price))) return 0;

    switch (typeof price) {
      case 'string':
        if (parseFloat(price) < 0) return 0;

        return Math.floor(parseFloat(price) * 100);
      case 'number':
        if (price < 0) return 0;

        return price;
      default:
        return 0;
    }
  } catch (e) {
    return 0;
  }
};

// prevents hanging decimals
const normalizeTax = (taxRate) => {
  try {
    const parsedTax = parseFloat(taxRate);

    if (isNaN(parsedTax)) return 0;
    if (parsedTax < 0) return 0;

    const normalizedTax = Math.floor(parsedTax * 10000) / 1000000;
    return normalizedTax;
  } catch (e) {
    return 0;
  }
};

const calcTaxAmount = (taxRate, itemPrice) => {
  const taxAmount = normalizeTax(taxRate) * normalizePrice(itemPrice);

  const roundedAmount = Math.ceil(taxAmount);

  return roundedAmount;
};

const calcItemsAddonsTaxes = (addonsArr) => {
  let addonsTaxAmount = 0;

  for (let i = 0; i < addonsArr.length; i += 1) {
    addonsTaxAmount += calcTaxAmount(addonsArr[i].addonTax, addonsArr[i].addonPrice);
  }

  return addonsTaxAmount;
};

function calcTaxTotal(cart) {
  const taxTotal = cart.map((cartItem) => {
    const itemTaxAmount = calcTaxAmount(cartItem.item.itemTax, cartItem.item.itemPrice);

    const itemsAddonsTaxAmount = calcItemsAddonsTaxes(cartItem.addonsArr);

    console.log('itemsAddonsTaxAmount', itemsAddonsTaxAmount);

    console.log((itemTaxAmount + itemsAddonsTaxAmount) * cartItem.quantity);

    console.log(Math.ceil(itemTaxAmount + itemsAddonsTaxAmount) * cartItem.quantity);

    return (itemTaxAmount + itemsAddonsTaxAmount) * cartItem.quantity;
  })
    .reduce((a, b) => a + b);

    console.log(taxTotal, taxTotal);

  return taxTotal;
}

// On
function calcFeeAmount(cart) {
  const uniqueStores = [];

  cart.forEach((cartItem) => {
    if (uniqueStores.indexOf(cartItem.item.itemStoreId) === -1) {
      uniqueStores.push(cartItem.item.itemStoreId);
    }
  });

  const feeTotal = uniqueStores.reduce((curr, next, i) => {
    if (i === 0) return 350;
    return curr + 200;
  }, 0);

  return feeTotal;
}

function calcSubTotal(cart) {
  const subTotal = cart.map((cartItem) => {

    const itemPrice = normalizePrice(cartItem.item.itemPrice);

    let itemsAddonsPrice = 0;
    for (let i = 0; i < cartItem.addonsArr.length; i += 1) {
      itemsAddonsPrice += normalizePrice(cartItem.addonsArr[i].addonPrice);
    }

    console.log('itemsAddonsPrice', itemsAddonsPrice);
    console.log('item sub total', (itemPrice + itemsAddonsPrice));

    return (itemPrice + itemsAddonsPrice) * cartItem.quantity;
  })
    .reduce((a, b) => a + b);

    console.log(subTotal);

  return subTotal;
}

function checkCartToTellIfThisStoresAgeRestriced(cart, storeId) {
  let ageRestricted = 0;

  cart.forEach((cartItem) => {
    if (cartItem.item.itemAgeRestricted > ageRestricted) {
      if (parseInt(cartItem.item.itemStoreId, 10) === parseInt(storeId, 10)) {
        ageRestricted = cartItem.item.itemAgeRestricted;
      }
    }
  });

  return ageRestricted;
}

function checkCartForSubTotal(cart) {
  const subTotal = cart.reduce((currItem, nextItem) => {
    const itemAddonsSubTotal = nextItem.addonsArr.reduce((curr, nextAdddon) => {
      return curr + normalizePrice(nextAdddon.addonPrice);
    }, 0);

    const itemSubTotal = normalizePrice(nextItem.item.itemPrice);

    return (currItem + (itemAddonsSubTotal + itemSubTotal));
  }, 0);

  return subTotal * 100;
}

function checkCartForFeeTotal(cart) {
  const uniqueStores = [];

  const FeeTotal = cart.forEach((cartItem) => {
    if (uniqueStores.indexOf(cartItem.item.itemStoreId) === -1 ) {
      uniqueStores.push(cartItem.item.itemStoreId);
    }
  });

  const feeTotal = uniqueStores.reduce((curr, next, i) => {
    if (i === 0) return 350;

    return curr + 200;
  }, 0);

  return feeTotal;
}

function checkCartForStoreIds(cart) {
  const uniqueStoreIds = [];

  cart.forEach((cartItem) => {
    if (uniqueStoreIds.indexOf(cartItem.item.itemStoreId) === -1) {
      uniqueStoreIds.push(cartItem.item.itemStoreId);
    }
  });

  return uniqueStoreIds;
}

function is18(DOB) {
  const userClaimedAge = moment(DOB);
  const eighteenYearsAgo = moment().subtract(18, 'years');
  return eighteenYearsAgo - userClaimedAge > 0;
}

function is21(DOB) {
  const userClaimedAge = moment(DOB);
  const twentyOneYearsAgo = moment().subtract(21, 'years');

  return twentyOneYearsAgo - userClaimedAge > 0;
}

function removeSpecialChars(val) {
  return val.replace(/[^\d.-]/g, '');
}

function splitOrdersIntoStore(uniqueStoreIds, cart) {
  const storeOrders = uniqueStoreIds.map((nextStoreId) => {
    const itemsInCart = cart.filter((itemObj) => {
      if (parseInt(nextStoreId, 10) === parseInt(itemObj.item.itemStoreId, 10)) {
        return true;
      }

      return false;
    });

    return itemsInCart;
  });

  return storeOrders;
}

function validateNumberPositiveOrZero(val) {
  try {
    if (isNaN(val)) return false;
    if (parseFloat(val) >= 0) return true;

    return false;
  } catch (e) {
    return false;
  }
}

function validateIsNumberAndPositve(val) {
  try {
    if (isNaN(val)) return false;
    if (parseFloat(val) > 0) return true;

    return false;
  } catch (e) {
    return false;
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
}

const formatForURL = (str) => {
  const replaceAnd = str.replace(/&/g, 'and');
  const cleansedOfSpecChars = replaceAnd.replace(/[^\w\s]/gi, '');
  const urlFriendly = cleansedOfSpecChars.replace(/ +/g, '-');

  return urlFriendly.toLowerCase();
};

const capitalizeFirstLetter = str => (
  `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`
);

const calcCartAmount = (cart) => {
  return calcFeeAmount(cart) + calcSubTotal(cart) + calcTaxTotal(cart);
};

module.exports = {
  calcCartAmount,
  calcFeeAmount,
  calcSubTotal,
  calcTaxAmount,
  calcTaxTotal,
  capitalizeFirstLetter,
  checkCartToTellIfThisStoresAgeRestriced,
  checkCartForStoreIds,
  checkCartForSubTotal,
  checkCartForFeeTotal,
  formatForURL,
  is18,
  is21,
  normalizePrice,
  normalizeTax,
  removeSpecialChars,
  splitOrdersIntoStore,
  stylePhone,
  validateEmail,
  validateIsNumberAndPositve,
  validateNumberPositiveOrZero,
};
