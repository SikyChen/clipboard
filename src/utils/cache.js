
class Cache {
  constructor({ name = '' }) {
    this.name = name;
    const storageList = localStorage.getItem(this.name);
    this.list = storageList ? JSON.parse(storageList) : [];
  }

  setList = (list) => {
    this.list = list;
    localStorage.setItem(this.name, JSON.stringify(list));
  }
}

export const ClipboardCache = (() => {
  let cache;
  return class ClipboardCache {
    constructor() {
      if (!cache) {
        cache = new Cache({ name: 'clipboard-list' });
      }
      return cache;
    }
  }
})();
