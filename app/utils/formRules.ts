
// 必填项
export const required = (t: (key: string) => string) => ({
  required: true,
  message: t('common.required')
})

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export function urlValidator(rule, value, callback) {
  if (!value || value.length == 0) {
    return callback(new Error('不能为空'));
  }
  if (!validURL(value) && value.indexOf("iurl://") < 0) {
    return callback(new Error('URL链接格式错误，必须以http(s)://开头'));
  }
  callback();
}

export function validCode(code) {
  const reg = /^[A-Za-z0-9_]+$/
  return reg.test(code);
}

export function codeValidator(rule, value, callback) {
  if (!value || value.length == 0) {
    return callback(new Error('不能为空'));
  }
  if (!validCode(value)) {
    return callback(new Error('只能使用大小写字母、数字和下划线'));
  }
  callback();
}
