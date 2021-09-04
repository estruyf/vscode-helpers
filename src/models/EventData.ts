

export interface EventData<T> extends MessageEvent<T> {
  command: string;
  data: T;
}