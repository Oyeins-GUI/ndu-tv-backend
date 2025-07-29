export interface IEventService {
  /**
   * Emits an event async using nesjt event emitter
   * @param event_name - The name of the event
   * @param event_payload - Event data
   * @returns a promise
   */
  emitAsync<T>(event_name: string, event_payload: T): Promise<unknown>;

  /**
   * Emits an event using nesjt event emitter
   * @param event_name - The name of the event
   * @param event_payload - Event data
   * @returns a boolean
   */
  emit<T>(event_name: string, event_payload: T): boolean;
}
