/**
 * @description 报名表单管理 —— 科研之星报名管理页面的请求。
 * @Author: 蒋雯绘
 */
import lsjRequest from '../..'


/**
 * @description 进入科研页面就发起的请求
 * @param {any} Authorization token
 * @method get
 */
export function JWHgetresearchRequest(Authorization:any) {
  return lsjRequest.get({
    url: '/api/stu/getsci',
    headers: { Authorization }
  })
}

/**
 * @description 修改科研之星。
 * @param {string} sciname 虚拟/实体
 * @param {string} scigrade 公司规模
 * @param {string} ranking 申报人排名
 * @param {string} signuptime 注册时间
 * @param {string} url 佐证材料
 * @param {string} id key
 * @method post
 */
export function JWHeditreserchRequest(sciname:string,scigrade:string,ranking:string,signuptime:string,url:any,id:string) {
  return lsjRequest.post({
    url: '/api/stu/editsci',
    data: { sciname,scigrade,ranking,signuptime,url, id }
  })
}
/**
 * @description 删除科研之星。
 * @param {string} form_id 编号
 * @method post
 */
export function JWHdeleteRequest(form_id:string) {
  return lsjRequest.post({
    url: '/api/stu/deleteSic',
    data: { form_id }
  })
}
/**
 * @description 上传科研之星文件。
 * @param {file} file 文件
 * @method post
 */
export function JWHupfileRequest(file:File,Authorization:any) {
  // console.log(file)
  // console.log(Authorization)
  const formData = new FormData();
  formData.append('file', file);
  return lsjRequest.post({
    url: '/api/stu/OssUpdate',
    data:formData,
    headers: { Authorization, 'Content-Type': 'multipart/form-data'  } //加请求头
  })
}

/**
 * @description 查询科研之星驳回理由
 * @method get
 */
export function JWHgetreasonRequest(form_id:string,Authorization:any) {
  return lsjRequest.get({
    url: '/api/stu/getreasonSic',
    params: { form_id},
    headers: { Authorization }
  })
}

