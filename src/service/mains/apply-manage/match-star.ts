/**
 * @description 报名表单管理 —— 竞赛之星报名管理页面的请求。
 * @Author: 钟胡琴
 */
import lsjRequest from '../..'

/**
 * @description 获取竞赛之星表格数据。
 * @param null
 * @method get
 */
export function ZHQgetCompetition() {
  return lsjRequest.get({
    url: '/api/stu/getcompetition'
  })
}
