interface ISessionStorage<T> {
  key: string
  defaultValue: T
}

/**
 * @description: 封装sessionStorage，使用更方便，也方便统一管理
 * @param {string} key
 * @param {T} defaultValue
 * @return {T}
 * @example:
 * const storage = new SessionStorage('key', 'defaultValue')
 * storage.setItem('value')
 * storage.getItem()
 * storage.removeItem()
 */

class SessionStorage<T> implements ISessionStorage<T> {
  key: string

  defaultValue: T

  constructor(key: string, defaultValue: T) {
    this.key = key
    this.defaultValue = defaultValue
  }

  setItem(value: T) {
    sessionStorage.setItem(this.key, JSON.stringify(value))
  }

  removeItem() {
    sessionStorage.removeItem(this.key)
  }

  getItem(): T {
    const value = sessionStorage[this.key] && sessionStorage.getItem(this.key)
    if (value === undefined) return this.defaultValue
    try {
      return value && value !== 'null' && value !== 'undefined'
        ? (JSON.parse(value) as T)
        : this.defaultValue
    } catch (error) {
      return value && value !== 'null' && value !== 'undefined'
        ? (value as unknown as T)
        : this.defaultValue
    }
  }
}

export default SessionStorage
