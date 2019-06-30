import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/demandmanager/list',
    method: 'get',
    params: query
  })
}

export function fetchDemandManager(id) {
  return request({
    url: '/demandmanager/detail',
    method: 'get',
    params: { id }
  })
}



export function createDemandManager(data) {
  return request({
    url: '/demandmanager/create',
    method: 'post',
    data
  })
}

export function updateDemandManager(data) {
  return request({
    url: '/demandmanager/update',
    method: 'post',
    data
  })
}
