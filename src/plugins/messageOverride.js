import { Notification } from 'element-ui'
import i18n from '@/lang'
// 统计弹窗类型
const typeList = [
  {
    tit: '警告',
    type: 'warning'
  },
  {
    tit: '成功',
    type: 'success'
  },
  {
    tit: '错误',
    type: 'error'
  },
  {
    tit: '消息',
    type: 'info'
  }
]
/**
 * @description  message方法方式触发提醒窗
 * @author bing
 * @date 2022-12-08 14:01
 * @param {Array} type  弹窗类型
 * @param {String} message  提醒
 * @param {Object} data  剩余参数
 * @returns {*} Notification对象
 */
const message = ({ type, message, ...data }) => {
  let msgType = (typeList.find((ite) => ite.type == type) || { type: '' }).type
  return Notification({
    title: msgType ? i18n.$t('common')[msgType] : '',
    message: message,
    type: type,
    ...data
  })
}
// message.* 点对象方式触发
typeList.forEach((ite) => {
  return (message[ite.type] = (msg) => {
    Notification({
      title: i18n.$t('common')[ite.type],
      message: msg,
      type: ite.type
    })
  })
})
//出口
export const Message = message
