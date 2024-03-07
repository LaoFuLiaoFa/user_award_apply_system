/**
 * @description 注册的请求。
 * @Author: 蒋雯绘
 */
import lsjRequest from '../..'

/**
 * @description 点击注册按钮进入系统发起的请求。
 * @param {string} grade 年级
 * @param {string} major 专业
 * @param {string} myclass 班级
 * @param {string} stuname 姓名
 * @param {string} stuid 学号
 * @param {string} password 密码
 * @param {string} email 邮箱
 * @param {string} code 验证码
 * @param {string} hascode 验证码密钥
 * @method post
 */
export function JWHsigninRequest(grade: string,major: string,myclass: string,stuname: string,stuid: string,password: string,email: string,code: string,hascode: any) {
  return lsjRequest.post({
    url: '/api/stu/register',
    data: { grade,major,class:myclass,stuname,stuid,password,email,code,hascode }
  })
}

/**
 * @description 进入系统就发起的请求:获取年级,专业,班级。
 * @method get
 */
export function JWHgetgradeRequest() {
  return lsjRequest.get({
    url: '/api/getgrade',
  })
}
export function JWHgetmajorRequest(grade:string) {
  return lsjRequest.get({
    url: '/api/getmajor',
    params: { grade}
  })
}
export function JWHgetclassRequest(grade:string,major:string) {
  return lsjRequest.get({
    url: '/api/getclass',
    params: { grade,major}
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
