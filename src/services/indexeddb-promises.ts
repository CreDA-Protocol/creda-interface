/**
 * Promisified IndexedDB wrapper class
 */
export class PromisifiedIndexedDB {
  private db: Promise<IDBDatabase>;

  /**
   * IMPORTANT: We use one database per store, because of the way indexed DB requires to create the
   * stores only during the "upgrade" operation, and the upgrade is done only once every time the
   * database "version" changes. As we don't know which stores will be created (for caches etc),
   * it's smoother to work with one store per database.
   */
  constructor(private storeName: string) {
    const databaseName = storeName;

    this.db = new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName);

      request.onerror = (): void => reject(request.error);
      request.onsuccess = (): void => {
        //if (request.result.objectStoreNames.contains(storeName))
        resolve(request.result);
      }

      request.onupgradeneeded = (ev): void => {
        if (!request.result.objectStoreNames.contains(storeName))
          request.result.createObjectStore(storeName);
      };
    });
  }

  private getObjectStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    return this.db.then((db) => {
      const transaction = db.transaction(this.storeName, mode);
      return transaction.objectStore(this.storeName);
    });
  }

  public get<T>(key: string): Promise<T> {
    return this.getObjectStore('readonly').then((store) => {
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onerror = (): void => reject(request.error);
        request.onsuccess = (): void => resolve(request.result);
      });
    });
  }

  public put<T>(key: string, value: T): Promise<void> {
    return this.getObjectStore('readwrite').then((store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(value, key);
        request.onerror = (): void => reject(request.error);
        request.onsuccess = (): void => resolve();
      });
    });
  }

  public delete<T>(key: string): Promise<void> {
    return this.getObjectStore('readwrite').then((store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onerror = (): void => reject(request.error);
        request.onsuccess = (): void => resolve();
      });
    });
  }
}
