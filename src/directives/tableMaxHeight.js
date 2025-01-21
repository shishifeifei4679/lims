import {
  addResizeListener,
  removeResizeListener,
} from "element-ui/src/utils/resize-event";
// 设置表格高度
const doResize = async (el, binding, vnode) => {
  const { componentInstance: $table } = await vnode;
  if (!$table) return;
  if ($table.$parent.maxHeight) return;
  let maxHeight = 0;
  let sunHeight = 0;
  const paginationHeight = 60; // 表格底部分页的高度 + margin值 加页面底部padding
  if ($table.pagination) sunHeight += paginationHeight;
  setTimeout(() => {
    // 计算列表高度并设置
    maxHeight = window.innerHeight - el.getBoundingClientRect().top - sunHeight;
    $table.$parent.selfMaxHeight = maxHeight;
    setTimeout(() => {
      $table.doLayout && $table.doLayout();
    }, 0);
  }, 200);
};

export default {
  // 初始化设置
  bind(el, binding, vnode) {
    const { componentInstance: $table } = vnode;
    if ($table.$parent.maxHeight) return;
    // 设置resize监听方法
    el.resizeListener = async () => {
      await doResize(el, binding, vnode);
    };
    // 绑定监听方法到addResizeListener
    addResizeListener(el, throttle(el.resizeListener, 20));
  },
  // // 绑定默认高度
  async inserted(el, binding, vnode) {
    const { componentInstance: $table } = vnode;
    if ($table.$parent.maxHeight) return;
    const appPage = document.getElementById("appPage");
    const isvertical = document.querySelector(
      "#scrollbar-main>.is-vertical>.el-scrollbar__thumb"
    );
    isvertical.style.display = "none";
    appPage.resizeListener = async () => {
      await doResize(el, binding, vnode);
    };
    addResizeListener(appPage, throttle(appPage.resizeListener, 20));
  },
  // // 销毁时设置
  unbind(el) {
    // 移除resize监听
    const appPage = document.getElementById("appPage");
    removeResizeListener(el, el.resizeListener);
    removeResizeListener(appPage, appPage.resizeListener);
    const isvertical = document.querySelector(
      "#scrollbar-main>.is-vertical>.el-scrollbar__thumb"
    );
    isvertical.style.display = "block";
  },
};

// 节流
function throttle(fn, delay) {
  let valid = true;
  return function () {
    if (!valid) return false;
    valid = false;
    setTimeout(() => {
      fn();
      valid = true;
    }, delay);
  };
}
