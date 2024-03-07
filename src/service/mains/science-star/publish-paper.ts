/**
 * @description 科研之星报名 —— 发表论文页面的请求。
 * @Author: 钟胡琴
 */
import lsjRequest from '../..'

/**
 * @description 方法描述
 * @param {} formState 收集表单数据的对象
 * @param {string} sciname 期刊名称
 * @param {string} scigrade 论文名称
 * @param {string} signuptime 发表时间
 * @param {string} scitype 标题：发表论文
 * @param {string} ranking 排名/总人数
 * @param {string} url 佐证材料
 * @method post
 * @return void
 */
export function zhqparperRequest(formState: {
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
