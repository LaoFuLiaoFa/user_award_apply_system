/**
 * @description 忘记密码的请求。
 * @Author: 蒋雯绘
 */
import lsjRequest from '../..'

/**
 * @description 点击提交进入系统发起的请求。
 * @param {string} stuid 学号
 * @param {string} email 邮箱
 * @param {string} code 验证码
 * @param {string} hascode 验证码密钥
 * @param {string} password 密码
 * @method post
 */
export function JWHforgetRequest(stuid: string,email: string,code: string,hascode: any,password: string) {
  return lsjRequest.post({
    url: '/api/stu/ForgetPassword',
    data: { stuid,email,code,hascode,password }
  })
}

/**
 * @description 点击发送验证码按钮进入系统发起的请求。
 * @param {string} email 邮箱
 * @method post
 */
export function JWHemailRequest(email: string) {
  return lsjRequest.post({
    url: '/api/stu/sendemail',
    data: { email }
  })
}
