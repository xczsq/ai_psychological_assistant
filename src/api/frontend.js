import service from '@/untils/request'

export function register(data) {
  return service.post('/user/add', data)
}

export const startSession = (data) => {
  return service.post('/psychological-chat/session/start', data)
}
