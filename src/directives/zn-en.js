import Vue from "vue"
import app from "../main.js"
// ele-table-editor 操作列表头与删除按钮国际化处理
Vue.directive("cnEn", {
  //属性名称maxWindow，前面加v- 使用
  bind(el, binding, vnode, oldVnode) {
    setTimeout(() => {
      // 表头 操作 国际化
      let dialogHeaderEl = (el.querySelector(".ele-table-editor .el-table__header-wrapper .el-table__header .has-gutter") ? el.querySelector(".ele-table-editor .el-table__header-wrapper .el-table__header .has-gutter") : el.querySelector(".ele-table-editor .el-table__header-wrapper .el-table__header thead"))
        .children[0].children
      let {
        componentInstance: { isShowActionColumn, isShowDelete }
      } = vnode
      if (isShowActionColumn && dialogHeaderEl.length > 0) {
        for (let y = 0; y < dialogHeaderEl.length; y++) {
          if (dialogHeaderEl[y].innerText && dialogHeaderEl[y].innerText == "操作") {
            dialogHeaderEl[y].lastChild.innerHTML = $i18n.t('common.operate')
          }
        }
      }
      // 行上 删除 国际化
      let dialogHeaderEl2 = el.querySelector(".ele-table-editor .el-table__body-wrapper .el-table__body tbody").children
      if (isShowDelete && isShowActionColumn && dialogHeaderEl2.length) {
        for (let i = 0; i < dialogHeaderEl2.length; i++) {
          if (dialogHeaderEl2[i] && dialogHeaderEl2[i].children && dialogHeaderEl2[i].children.length) {
            let operations = dialogHeaderEl2[i].children[dialogHeaderEl2[i].children.length - 1].lastChild.children
            if (operations && operations.length) {
              for (let z = 0; z < operations.length; z++) {
                if (operations[z].innerText && operations[z].innerText == "删除") {
                  operations[z].lastChild.innerHTML = $i18n.t('common.delete')
                }
              }
            }
          }
        }
      }
    })
  },
  update(el, binding, vnode, oldVnode) {
    setTimeout(() => {
      // 如果有 新增 按钮，每次新增需要再执行一下指令国际化 删除
      let dialogHeaderEl = el.querySelector(".ele-table-editor .el-table__body-wrapper .el-table__body tbody").children
      let {
        componentInstance: { isShowActionColumn, isShowDelete }
      } = vnode
      if (isShowDelete && isShowActionColumn && dialogHeaderEl.length) {
        for (let i = 0; i < dialogHeaderEl.length; i++) {
          if (dialogHeaderEl[i] && dialogHeaderEl[i].children && dialogHeaderEl[i].children.length) {
            let operations = dialogHeaderEl[i].children[dialogHeaderEl[i].children.length - 1].lastChild.children
            if (operations && operations.length) {
              for (let z = 0; z < operations.length; z++) {
                if (operations[z].innerText && operations[z].innerText == "删除") {
                  operations[z].lastChild.innerHTML = $i18n.t('common.delete')
                }
              }
            }
          }
        }
      }
    })
  }
})
