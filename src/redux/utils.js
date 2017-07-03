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

export const update = (m, id, updater) => {
  const old = m.get(id) || {};
  return setMap(m, id, updater(old));
};

export const bulkMerge = (m, a) => {
  const nm = new Map(m);
  a.forEach((x) => {
    const old = m.get(x.id) || {};
    nm.set(x.id, { ...old, ...x });
  });
  return freezeMap(nm);
};
