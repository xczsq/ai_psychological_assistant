import service from '@/untils/request'

export function register(data) {
  return service.post('/user/add', data)
}

export const startSession = (data) => {
  return service.post('/psychological-chat/session/start', data)
}

export const getSessionList = (params) => {
  return service.get('/psychological-chat/sessions', { params })
}

export const deleteSession = (sessionId) => {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}