/**
 * @description 双创之星报名页面的请求。
 * @Author: 钟胡琴
 */
import lsjRequest from '../..'

/**
 * @description 方法描述
 * @method post / get
 * @return 没有返回信息写 void / 有返回信息 {返回类型} 描述信息
 * @param formState
 */
export function zhqdoubleRequest(formState: {
  companyname: string
  vp: string
  ranking: string
  signuptime: string
  scale: string
  url: string
}) {
  return lsjRequest.post({
    url: '/api/stu/commitcompany',
    data: formState
  })
}
