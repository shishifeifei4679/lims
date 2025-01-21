module.exports = {
  name: "制造管理平台",  // 系统名称
  publicPath: "/mom/component/lims/",  // 公共路径，用于根目录部署还是非根目录部署，例如：/admin/
  outputDir: "dist",  // 打包时文件的输出位置默认"dist", 例如：dist/admin
  pathReplaceStr: '/component/lims'  // 当系统不在qiankun下运行时，左侧菜单路由需要替换掉前缀，如主应用的资源中配置的路由为/component/mes/team/mesTeam，修改为/team/mesTeam
};
