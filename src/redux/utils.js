import freezeMap from '../helpers/freezeMap';

export const setMap = (m, k, v) => {
  const nm = new Map(m);
  nm.set(k, v);
  return freezeMap(nm);
};

export const merge = (m, v) => {
  const old = m.get(v.id) || {};
  return setMap(m, v.id, { ...old, ...v });
};

export const update = (m, k, updater) => {
  const old = m.get(k) || {};
  return setMap(m, k, updater(old));
};

export const bulkMerge = (m, a) => {
  const nm = new Map(m);
  a.forEach((x) => {
    const old = m.get(x.id) || {};
    nm.set(x.id, { ...old, ...x });
  });
  return freezeMap(nm);
};

export const del = (m, k) => {
  const nm = new Map(m);
  nm.delete(k);
  return freezeMap(nm);
};
