export const setMap = (m, k, v) => {
  const nm = new Map(m);
  nm.set(k, v);
  return nm;
};

export const bulkSetMap = (m, a) => {
  const nm = new Map(m);
  a.forEach(x => nm.set(x.id, x));
  return nm;
};

export const merge = (m, v) => {
  const old = m.get(v.id) || {};
  return setMap(m, v.id, { ...old, ...v });
};

export const bulkMerge = (m, a) => {
  const nm = new Map(m);
  a.forEach((x) => {
    const old = m.get(x.id) || {};
    nm.set(x.id, { ...old, ...x });
  });
  return nm;
};