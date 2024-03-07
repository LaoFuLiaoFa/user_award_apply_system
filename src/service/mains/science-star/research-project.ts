/**
 * @description 科研之星报名 —— 科研项目页面的请求。
 * @Author: 钟胡琴
 */
import lsjRequest from '../..'

/**
 * @description 方法描述
 * @param {} formState 收集表单数据的对象
 * @param {string} sciname 项目名称
 * @param {string} scigrade 项目级别
 * @param {string} signuptime 立项时间
 * @param {string} scitype 标题：科研项目
 * @param {string} ranking 排名/总人数
 * @param {string} url 佐证材料
 * @method post
 * @return void
 */
export function zhqresearchRequest(formState: {
  sciname: string
  scigrade: string
  signuptime: string
  scitype: string
  ranking: string
  url: string
}) {
  return lsjRequest.post({
    url: '/api/stu/commitsci',
    data: formState
  })
}
