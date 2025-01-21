import Vue from "vue";
import Element from "element-ui";
import "@/scss/element-variables.scss";
import "element-ui/lib/theme-chalk/base.css";
Vue.use(Element, { size: "small" });

import { Message } from "./messageOverride";
/**
 * @author bing
 * @since 2022-12-08 14:00:38
 *  重写 message  为  Notification
 */
//@Override
Vue.prototype.$message = Message;
