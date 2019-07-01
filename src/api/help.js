import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/help/list',
    method: 'post',
    params: query
  })
}

export function fetchHelp(id) {
  return request({
    url: '/help/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/help/pv',
    method: 'get',
    params: { pv }
  })
}

export function createHelp(data) {
  return request({
    url: '/help/create',
    method: 'post',
    data
  })
}



