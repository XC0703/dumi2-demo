export default interface IRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: { [key: string]: string }
  body?: BodyInit
}
