declare module "lodash";

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}
