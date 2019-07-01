import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'road/list',
    method: 'get',
    params: query
  })
}

export function fetchRoad(id) {
  return request({
    url: '/road/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/road/pv',
    method: 'get',
    params: { pv }
  })
}

export function createRoad(data) {
  return request({
    url: '/road/create',
    method: 'post',
    data
  })
}

export function updateRoad(data) {
  return request({
    url: '/road/update',
    method: 'post',
    data
  })
}

