# Replicate code2prompt using TypeScript by Cursor

参考[如何让“学源码”变得轻松、有意义](https://mp.weixin.qq.com/s/RuwB9L5HNbPvNdJsQZGsIQ)这篇文章，使用 TypeScript 复现了 code2prompt 的逻辑。

## 项目运行

```bash
npm install # 安装依赖
npm run start [path] # 运行
npm run build # 编译
```

### 运行
`npm run start [path]` 其中 path 是你要转换的代码的路径，比如：

```bash
npm run start ../tartget_project/
```

## 遇到的问题
1. `clipboardy` 无法使用，使用 `copy-paste` 代替
2. 读取文件时遇到特殊符号（例如 `'` 被识别为 `&#x27;`, `=` 被识别为 `&#x3D;`），使用 `he` 进行编码
3. 遍历读取文件时，没有排除 `.git` 目录、图片类型文件等，需要进一步处理


