export interface IResponse<T> {
  data: T;
  result: boolean;
  message?: string;
}
