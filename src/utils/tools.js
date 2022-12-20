
export const uniqeId = (function() {
  let map = {};
  return function uniqeId(prefix) {
    if (map[prefix] === undefined) {
      map[prefix] = 0;
    } else {
      map[prefix] = map[prefix] + 1;
    }
    return prefix + map[prefix];
  }
})();
