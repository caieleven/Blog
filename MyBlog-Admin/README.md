# MyBlog Admin

MyBlog后台前端项目。

声明：非前端技术人员，页面和逻辑完全按照自己的意愿编写，在很多方面可能存在不合理或者不规范的地方。

后台项目管理：[Github](https://github.com/snwjas/MyBlog) | [Gitee](https://gitee.com/snwjas/my-blog)



## 技术栈

- Vue.js2 全家桶
- Element-UI
- [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 后台模板
- axios
- echarts
- [mavon-editor](https://github.com/hinesboy/mavonEditor)
- 等等



## 快速开始

安装依赖：

```shell
npm install
```

开发环境运行：

```shell
npm run dev
```

静态资源打包：

```shell
npm run build:prod
```



修改基本应用请求API

修改根目录下的`.env.production`（生产环境）和`.env.development`（开发环境）文件下的`VUE_APP_BASE_API`



## 已知Bug

- 标签
  - 点击标签进行修改时，会造成标签列表重新渲染

- 附件
  - 打开附件详情的时候，会发送两次图片（缩略图）请求