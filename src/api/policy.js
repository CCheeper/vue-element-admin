import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/policy/list',
    method: 'get',
    params: query
  })
}

export function fetchPolicy(id) {
  return request({
    url: '/policy/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/policy/pv',
    method: 'get',
    params: { pv }
  })
}

export function createPolicy(data) {
  return request({
    url: '/policy/create',
    method: 'post',
    data
  })
}

export function updatePolicy(data) {
  return request({
    url: '/policy/update',
    method: 'post',
    data
  })
}

export function uploadfile(data) {
    return request({
      url: '/upload',
      method: 'post',
      data
    })
  }
