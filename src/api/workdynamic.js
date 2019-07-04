import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/workdynamic/list',
    method: 'get',
    params: query
  })
}

export function fetchWorkdunamic(id) {
  return request({
    url: '/workdydnamic/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/workdynamic/pv',
    method: 'get',
    params: { pv }
  })
}

export function createWorkdynamic(data) {
  return request({
    url: '/workdynamic/create',
    method: 'post',
    data
  })
}

export function updateWorkdynamic(data) {
  return request({
    url: '/workdynamic/update',
    method: 'post',
    data
  })
}



