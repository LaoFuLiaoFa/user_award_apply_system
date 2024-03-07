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
/**
 * @description 获取竞赛之星修改表单（未审核状态下）。
 * @param {string} entryname 参赛名称
 * @param {string} signuptime 竞赛报名时间
 * @param {string} url 佐证材料
 * @method post
 */
export function ZHQeditcompetition(entryname: string, signuptime, url: string, id: string) {
  return lsjRequest.post({
    url: '/api/stu/editcompetition',
    data: { entryname, signuptime, url, id }
  })
}
/**
 * @description 删除竞赛之星表格数据。
 * @param {string} form_id 数据id
 * @method post
 */
export function ZHQdeleteJingsai(form_id: string) {
  return lsjRequest.post({
    url: '/api/stu/deleteJingsai',
    data: { form_id }
  })
}
/**
 * @description 竞赛之星查询驳回理由。
 * @param {string} form_id 数据id
 * @method get
 */
export function ZHQgetreasonJingsai(form_id: string) {
  return lsjRequest.get({
    url: `/api/stu/getreasonJingsai?form_id=${form_id}`
  })
}
