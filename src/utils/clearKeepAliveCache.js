import router from '@/router'
import sys from '@/config'
import { cachedInstanceMap } from '@/main'

export default function clearKeepAliveCache(tabsArray) {
  // 从routes中找到该路由的name属性
  const routes = router.options.routes;
  const layoutRoutes = routes.filter(route => route.name === 'Layout')[0]?.children || [];
  const tabsNameArray = tabsArray.map(tab => layoutRoutes.find(item => sys.pathReplaceStr + item.path ===  tab.path)?.name)
  Object.keys(cachedInstanceMap).forEach(cache => {
    if (!tabsNameArray.includes(cachedInstanceMap[cache].name)) {
      console.log(cachedInstanceMap[cache].name + '-删除缓存成功')
      delete cachedInstanceMap[cache]
    }
  })
}
