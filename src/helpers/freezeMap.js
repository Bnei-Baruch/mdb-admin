/* eslint-disable no-param-reassign */

/**
 * An es6 Map freezer
 * Based on https://stackoverflow.com/questions/35747325/is-there-a-way-to-freeze-a-es6-map
 */

const mapSet = (key) => {
  throw new Error(`Can't add property ${key}, map is not extensible`);
};

const mapDelete = (key) => {
  throw new Error(`Can't delete property ${key}, map is frozen`);
};

const mapClear = () => {
  throw new Error('Can\'t clear map, map is frozen');
};

const freezeMap = (m) => {
  m.set    = mapSet;
  m.delete = mapDelete;
  m.clear  = mapClear;
  return Object.freeze(m);
};

export default freezeMap;
