/**
 * @description 竞赛之星页面的请求。
 * @Author: 钟胡琴
 */
import lsjRequest from '../..'
import type { Dayjs } from 'dayjs'

/**
 * @description 竞赛之星表单提交
 * @method post
 * @return void
 */
export function ContestRequest(formState: { entryname: string; signuptime: string; url: string }) {
  return lsjRequest.post({
    url: '/api/stu/submitcompetition',
    data: formState
  })
}
