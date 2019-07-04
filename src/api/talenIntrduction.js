import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/talentintrduction/list',
    method: 'get',
    params: query
  })
}

export function fetchTalentintrduction(id) {
  return request({
    url: '/talentintrduction/detail',
    method: 'get',
    params: { id }
  })
}



export function createTalentintrduction(data) {
  return request({
    url: '/talentintrduction/create',
    method: 'post',
    data
  })
}

export function updateTalentintrduction(data) {
  return request({
    url: '/talentintrduction/update',
    method: 'post',
    data
  })
}