# 0.开发技术栈

vue + ts + ant
选择ant的原因：使用二维码组件（带东软icon图标的那种）
地址：https://www.antdv.com/components/overview-cn

# 1.集成规范。

- VScode需要安装一个插件，让.editorconfig文件生效；
  插件名： EditorConfig for VS Code
- 配置prettier，参考配置链接：https://zhuanlan.zhihu.com/p/355754937；
  插件名： Prettier - Code formatter
- 配置ESLint检测；
  插件名：ESLint

# 2.不能去修改现有的任何文件或者任何配置，如果需要修改，请开会时报告讨论后，再做改变。

# 3.一定要留痕，写文档注释。

注释规范：

- 文件注释规范：
<!--
    * @FileDescription: 该文件的描述信息
    * @Author: 作者信息
    * @Date: 文件创建时间
    * @LastEditors: 最后更新作者
    * @LastEditTime: 最后更新时间
 -->

- 方法注释规范
<!--(注意无这一行)
  /**
   * @description 方法描述
   * @param {参数类型} 参数名称
   * @param {参数类型} 参数名称
   * @return 没有返回信息写 void / 有返回信息 {返回类型} 描述信息
   */
-->(注意无这一行)

# 4.两阶段，静态页面写完后合并，然后封装网络请求相关，进行交互开发。

# 5.commit的时候规范提交，例如：李思佳提交静态页面。

git -t commit "李思佳"
