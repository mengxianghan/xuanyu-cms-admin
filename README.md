# xuanyu CMS 前端

<img src="https://github.com/mengxianghan/xuanyu-cms-front/blob/master/src/assets/images/logo.svg" height="200" />

xuanyu CMS是一款前后端分离快速后台开发框架，前端基于vue-ant-design，后端基于codeigniter轻量级php框架开发

后端代码请移步至 [https://github.com/mengxianghan/xuanyu-cms](https://github.com/mengxianghan/xuanyu-cms)

账号：admin  
密码：123456  

## 开发者信息
- 作者：mengxianghan
- QQ群：<a target="_blank" href="http://shang.qq.com/wpa/qunwpa?idkey=0d129222878ba69e9aae2ddd6d84f0800e985f83bfd19467ebb73e92c76badf9" title="轩宇网络">459909606</a>

## 特性
- 支持动态路由
- 菜单支持外部菜单
- 支持精确到操作按钮的权限控制
- 支持单独给角色和用户配置权限
- 支持单个用户配置多个角色

## 功能模块  
- 控制台
  - 工作台
- 系统管理
  - 菜单管理
  - 权限按钮管理
  - 字典管理
  - 角色管理
  - 用户管理
  - 部门管理
  - 岗位管理
- 信息管理
  - 栏目管理
  - 模版管理
  - 新闻管理
  - 单页管理

## 安装

```
# 安装依赖
npm install

# 本地运行
# 通过 localhost:8080 访问页面
npm run dev

# 生产环境构建
npm run build
```

## 配置

修改请求地址  
开发环境 `/config/dev.env.js`  
生产环境 `/config/prod.env.js`  
修改 `BASH_URL` 的地址  

路由 `/src/config/router.config.js`  
基础路由 `constantRoutesMap`  
白名单 `whiteList`  

## 更新日志  
1.0.0  
`2019-12-05`  
:boom: 对外第一个版本，提供cms的基本功能模块  