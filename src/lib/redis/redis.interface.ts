export interface IRedisCacheService {
  /**
   * Deletes a key or a set of keys and their values from Redis.
   * @param target - One or more Redis keys to delete.
   * @returns The number of keys deleted.
   */
  delete(target: string | string[]): Promise<number>;

  /**
   * Set a string field in redis
   * @param key - key value
   * @param value - string value
   * @param ttl - Time to live for the string, ttl is in seconds
   * @returns The status of the set string operation
   */
  setString(
    key: string,
    value: string | number,
    ttl?: number,
  ): Promise<string | null>;

  /**
   * Set a string if it does not already exist
   * @param key - Redis key
   * @param value - Value to store
   * @param ttl - Optional TTL in seconds
   * @returns The status of the set string operation
   */
  setStringIfNotExists(
    key: string,
    value: string | number,
    ttl?: number,
  ): Promise<string | null>;

  /**
   * Increments a string counter in redis
   * @param key - key value
   * @returns The new value and null if not available
   */
  incrementStringCounter(key: string): Promise<number | null>;

  /**
   * Gets a string field
   * @param key The string key
   * @returns The string value for the key or null if not found
   */
  getStringValue(key: string): Promise<string | null>;

  /**
   * Set a hash field in redis
   * @param key - Hash key
   * @param value - Value of hash
   * @param ttl - Time to live for the hash
   * @returns The number of field inserted into the hash
   */
  setHash<T extends Record<string, string | number | unknown>>(
    key: string,
    value: T,
    ttl?: number,
  ): Promise<number>;

  /**
   * Set a the value of a field in a hash
   * @param key - Hash key
   * @param value - Value of hash
   * @param ttl - Time to live for the hash
   * @returns The number of field inserted into the hash
   */
  setHashFieldValue(
    key: string,
    field: string,
    value: string | number | unknown,
  ): Promise<number>;

  /**
   * Sets the Time to live in seconds for a specific hash field or array of fields
   * @param key The hash key
   * @param fields Array containing field names or single field name
   * @param ttl Time to live in seconds
   * @returns void
   */
  setHashFieldExpiry(
    key: string,
    fields: string[] | string,
    ttl: number,
  ): Promise<void>;

  /**
   * Gets a field from a hash
   * @param key The hash key
   * @param field The field name to get
   * @returns The field value
   */
  getHashField(key: string, field: string): Promise<string | null>;

  /**
   * Gets all fields and values from a hash
   * @param key The hash key
   * @returns Record of all field-value pairs
   */
  getAllHashFields(key: string): Promise<Record<string, string> | null>;

  /**
   * Gets all fields from a hash with typed return
   * @param key The hash key
   * @returns Typed record of field-value pairs
   */
  getTypedHashFields<T extends Record<string, string | number | unknown>>(
    key: string,
  ): Promise<T | null>;

  /**
   * Adds an item to a Redis set
   * @param key The set key
   * @param value The value to add to the set
   * @param ttl Optional time to live for set
   * @returns Number of elements added
   */
  addToSet(key: string, value: string, ttl?: number): Promise<number>;

  /**
   * Gets all members of a Redis set
   * @param key The set key
   * @returns Array of members in the set
   */
  getSetMembers(key: string): Promise<string[]>;

  /**
   * Removes a value from a Redis set
   * @param key The set key
   * @param value The value to remove
   * @returns Number of elements removed
   */
  removeFromSet(key: string, value: string): Promise<number>;

  /**
   * Checks if a value exists in a Redis set
   * @param key The set key
   * @param value The value to check
   * @returns Boolean indicating existence
   */
  isMemberOfSet(key: string, value: string): Promise<boolean>;
}
