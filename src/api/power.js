import request from '@/utils/request'

export function searchUser(data){
    return request({
        url: '/power/sreach',
        method: 'post',
        data
      })
    }
export function editUserPower(data){
      return request({
        url: '/power/edit',
        method: 'post',
        data,

      })
}