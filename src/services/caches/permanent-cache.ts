import { PromisifiedIndexedDB } from '@services/indexeddb-promises';
import moment from 'moment';
import Queue from 'promise-queue';
import { BehaviorSubject } from 'rxjs';

const CACHE_VERSION = 3; // Versionning to allow "wiping" existing cache in case of internal breaking format change.

type CacheMissCallback<DataType extends object, CustomDataType> = (key: string, customData?: CustomDataType) => Promise<DataType> | DataType;

/**
 * Internal storage representation to hold additional information such as the expiration date
 */
type StoredItem<DataType extends IDBValidKey> = {
  data: DataType;
  expirationDate?: string; // ISO date at which the stored data is not valid any more
}

/**
 * Indexed-DB based cache for content such as dynamically fetched hive pictures.
 *
 * This is used for example to store pictures fetched from hive vaults in
 * order to avoid fetching them every time.
 *
 * This is also used by identities to cache names and avatars to display them rapidly instead of
 * having to fetch all credentials every time for that.
 *
 * Indexed db is used instead of local storage so we have no disk space limitation.
 */
export class PermanentCache<DataType extends object, CustomDataType> {
  private db: PromisifiedIndexedDB;
  private queue = new Queue(1); // TODO: one queue per key to not block different picture urls sequencially

  private listeners: { [key: string]: BehaviorSubject<DataType> } = {};

  constructor(storeName: string, private cacheMissCallback: CacheMissCallback<DataType, CustomDataType>, private expireAfterSeconds: number) {
    this.db = new PromisifiedIndexedDB(storeName);
  }

  public async get(key: string, customData?: CustomDataType, forceUpdate = false): Promise<DataType> {
    return this.queue.add(async () => {
      const storageKey = this.getStorageKey(key);
      const cachedData = await this.db.get<StoredItem<string>>(storageKey);

      const isExpired = cachedData?.expirationDate && moment().isAfter(cachedData.expirationDate);

      if ((forceUpdate || !cachedData || isExpired) && this.cacheMissCallback) {
        const value = await this.cacheMissCallback(key, customData);
        if (value !== undefined) // BEWARE: null is a valid value to cache
          await this.put(key, value);

        return value;
      }

      return cachedData?.data ? JSON.parse(cachedData?.data) : cachedData?.data// Return cachedData?.data if cachedData?.data is falsy because we need to preserve null vs undefined
    });
  }

  /**
   * Some caches update their content from the cache miss callback, but some
   * others need to manually set the value from external sources.
   */
  public async put(key: string, value: DataType): Promise<void> {
    const storageKey = this.getStorageKey(key);
    await this.db.put<StoredItem<string>>(storageKey, {
      data: JSON.stringify(value),
      expirationDate: this.expireAfterSeconds ? moment().add(this.expireAfterSeconds, "seconds").toISOString() : null
    });
    this.getListener(key).next(value);
  }

  public async delete(key: string) {
    const storageKey = this.getStorageKey(key);
    await this.db.delete<StoredItem<string>>(storageKey);
  }

  /**
   * Returns a subject that gets updated when an entry changes
   */
  public listen(key: string, customData?: CustomDataType): BehaviorSubject<DataType> {
    return this.getListener(key, customData);
  }

  private getListener(key: string, customData?: CustomDataType): BehaviorSubject<DataType> {
    if (!(key in this.listeners)) {
      this.listeners[key] = new BehaviorSubject(null);
      // After accessing a listener for the first time, fill it with the result of "get"
      // in case there is already some stored data
      this.get(key, customData).then(value => this.listeners[key].next(value));
    }
    return this.listeners[key];
  }

  /**
   * Returns the real storage key for a user key.
   */
  private getStorageKey(key: string): string {
    return CACHE_VERSION + "-" + key;
  }
}