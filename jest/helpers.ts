import { AxiosResponse } from 'axios'

export function createAxiosSuccessResponseMock<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'Success',
    headers: { 'Content-Type': 'application/json' },
    config: {},
  }
}
