<p align="center">
<img src="http://cdn.xuanyunet.com/common/images/logo.svg" height="200" />
</p>

# xuanyu CMS

xuanyu CMS 是一款前后端分离快速后台开发框架，前端基于 ant-design-vue ，后端基于 Codeigniter 轻量级 php 框架开发

前端  
Github地址：[https://github.com/mengxianghan/xuanyu-cms-admin](https://github.com/mengxianghan/xuanyu-cms-admin)  
码云地址：[https://gitee.com/1056811341/xuanyu-cms-admin](https://gitee.com/1056811341/xuanyu-cms-admin)  
后端  
Github地址：[https://github.com/mengxianghan/xuanyu-cms](https://github.com/mengxianghan/xuanyu-cms)  
码云地址：[https://gitee.com/1056811341/xuanyu-cms](https://gitee.com/1056811341/xuanyu-cms)

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
  - 系统日志
- 信息管理
  - 栏目管理
  - 模版管理
  - 新闻管理
  - 单页管理

## 预览
<table>
    <tr>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E5%B7%A5%E4%BD%9C%E5%8F%B0.png" alt="工作台"/></td>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E5%9F%BA%E6%9C%AC%E8%AE%BE%E7%BD%AE.png" alt="基本设置"/></td>
    </tr>
    <tr>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E8%8F%9C%E5%8D%95%E7%AE%A1%E7%90%86.png" alt="菜单管理"/></td>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86.png" alt=""/></td>
    </tr>
    <tr>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E8%AE%BE%E7%BD%AE%E6%9D%83%E9%99%90.png" alt=""/></td>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E9%83%A8%E9%97%A8%E7%AE%A1%E7%90%86.png" alt=""/></td>
    </tr>
	<tr>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E9%83%A8%E9%97%A8%E7%AE%A1%E7%90%86.png" alt=""/></td>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E6%96%B0%E9%97%BB%E7%AE%A1%E7%90%86.png" alt=""/></td>
    </tr>	 
    <tr>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E6%96%B0%E5%A2%9E%E6%96%B0%E9%97%BB.png" alt=""/></td>
        <td><img src="http://cdn.xuanyunet.com/cms/images/%E5%8D%95%E9%A1%B5%E7%AE%A1%E7%90%86.png" alt=""/></td>
    </tr>
</table>

## 安装

```
# 安装依赖
npm install

# 本地运行
# 通过 localhost:9999 访问页面
npm run serve

# 生产环境构建
npm run build
```

## 配置

修改请求地址  
开发环境 `env.development`  
生产环境 `env.production`  
修改 `VUE_APP_BASH_URL` 的地址  

路由 `/src/config/router.config.js`  
基础路由 `constantRoutesMap`  
白名单 `whiteList`  

## 更新日志  
1.0.3  
`2020-3-17`  
升级 vue-cli 到 vue-cli3  
生产环境使用 cdn 减小打包后的大小，减少首屏打开时间  

1.0.2  
`2019-12-18`  
新增 `DescriptionList` 描述列表组件  
新增系统日志  
优化登录日志，与系统日志合并  
优化请求响应数据，将请求成功时返回的状态码改为200，防止与Exception的默认状态码冲突  
修复配置信息每次加载页面时都重置的问题  
修复菜单超出屏幕高度后没有滚动条的问题  

1.0.1  
`2019-12-10`  
新增 `Upload` 上传组件    
优化新增用户时密码验证  
优化选择部门时部门数据默认展开
优化图片默认宽度

1.0.0  
`2019-12-05`  
:boom: 对外第一个版本，提供cms的基本功能模块  
