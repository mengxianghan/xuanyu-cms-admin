<p align="center">
<img src="http://q219t1n5l.bkt.clouddn.com/logo.svg" height="200" />
</p>

# xuanyu CMS

xuanyu CMS是一款前后端分离快速后台开发框架，前端基于vue-ant-design，后端基于codeigniter轻量级php框架开发

前端  
Github地址：[https://github.com/mengxianghan/xuanyu-cms-front](https://github.com/mengxianghan/xuanyu-cms-front)  
码云地址：[https://gitee.com/1056811341/xuanyu-cms-front](https://gitee.com/1056811341/xuanyu-cms-front)  
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
  - 系统日志 :fire:
- 信息管理
  - 栏目管理
  - 模版管理
  - 新闻管理
  - 单页管理

## 预览
<table>
    <tr>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/工作台.png" alt="工作台"/></td>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/基本设置.png" alt="基本设置"/></td>
    </tr>
    <tr>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/菜单管理.png" alt="菜单管理"/></td>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/用户管理.png" alt=""/></td>
    </tr>
    <tr>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/设置权限.png" alt=""/></td>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/部门管理.png" alt=""/></td>
    </tr>
	<tr>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/栏目管理.png" alt=""/></td>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/新闻管理.png" alt=""/></td>
    </tr>	 
    <tr>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/新增新闻.png" alt=""/></td>
        <td><img src="http://q219t1n5l.bkt.clouddn.com/单页管理.png" alt=""/></td>
    </tr>
</table>

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
