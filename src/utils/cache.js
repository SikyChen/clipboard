
class Cache {
  constructor({ name = '' }) {
    this.name = name;
    const storageList = localStorage.getItem(this.name);
    this.list = storageList ? JSON.parse(storageList) : [];
  }

  setList = (list) => {
    list = list.filter((item) => !!item);
    this.list = list;
    localStorage.setItem(this.name, JSON.stringify(list));
  }

  getList = () => {
    return this.list;
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
