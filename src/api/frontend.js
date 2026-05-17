import service from '@/untils/request'

export function register(data) {
  return service.post('/user/add', data)
}
