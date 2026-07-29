# tabby-quick-cmd-dock

> 快捷命令坞 · A quick-command **dock** at the bottom of your [Tabby](https://tabby.sh/) terminal.

在每个终端标签底部停靠一排**分组式快捷命令按钮**，点一下即可执行常用命令。支持分组下拉切换、命令上色、备注、执行前二次确认，所有管理（增删改分组与命令）都在终端底部栏内完成，无需离开终端。

*Based on [tabby-quick-cmds](https://github.com/minyoad/tabby-quick-cmds) (MIT), redesigned around a bottom command dock.*

---

## ✨ 功能特性

- **终端底部命令坞** — 每个终端标签底部一排快捷命令按钮，点击即执行
- **分组管理** — 命令按分组组织，左侧下拉框一键切换当前分组
- **就地增删改** — 在底部栏直接添加/编辑/删除分组和命令，弹窗录入，无需进设置页
  - 齿轮按钮 ⚙ → 添加 / 编辑 / 删除分组
  - `＋命令` 按钮 → 向当前分组添加命令
  - 命令按钮 **右键** → 编辑 / 删除
- **默认分组** — 为某个分组设为"默认显示"，新终端自动展示它
- **命令上色** — 预设色板（红/橙/黄/绿/蓝/紫/灰），给危险或常用命令上色区分
- **命令备注** — 悬停按钮即时显示备注与完整命令（快速自定义 tooltip，不卡顿）
- **执行前二次确认** — 可为单条命令开启，点击时先弹确认框，防止误触危险命令
- **自动回车** — 可选是否在命令末尾自动追加换行执行
- **命令快捷键** — 可为命令绑定全局快捷键直接触发
- **执行后自动聚焦终端** — 点完按钮光标立即回到终端，继续输入不打断
- **一键启用/禁用** — 设置页仅一个开关，关闭后底部栏隐藏
- **深浅主题自适应** — 跟随 Tabby 当前配色

## 📦 安装

发布到 npm 后，在 Tabby 中打开 **设置 → 插件**，搜索：

```
quick-cmd-dock
```

安装后**完整重启 Tabby** 即可。

## 🚀 使用

1. 打开任意终端标签，底部会出现快捷命令坞
2. 点击右侧齿轮 **⚙ → 添加分组**，建一个分组（如 `Git`、`Docker`）
3. 点击 **`＋命令`**，填写名称与命令内容，保存
4. 之后点击命令按钮即可把命令发送到当前终端

### 命令属性

| 属性 | 说明 |
|------|------|
| 名称 | 按钮显示的文字 |
| 命令内容 | 要发送到终端的命令，支持多行（每行依次发送） |
| 分组 | 归属的分组 |
| 备注 | 可选，悬停按钮时显示 |
| 颜色 | 预设色板，给按钮上色 |
| 执行前二次确认 | 开启后点击先弹确认框（默认关闭） |
| 自动回车 | 是否自动追加换行执行（默认开启） |

### 多行命令

命令内容直接换行即可，逐行发送：

```
cd ~/project
npm install
npm run dev
```

## ⚙️ 开发

```bash
npm install          # 安装依赖
npm run build        # 构建到 dist/
npm run watch        # 监听源码持续构建
```

插件入口为 `dist/index.js`。安装到本地 Tabby 插件目录测试：

- Windows: `%APPDATA%\tabby\plugins\node_modules`
- macOS: `~/Library/Application Support/tabby/plugins/node_modules`
- Linux: `~/.config/tabby/plugins/node_modules`

把构建产物（`dist`、`package.json`）放入以插件名命名的目录后重启 Tabby。

## 📄 License

[MIT](./LICENSE)。本项目基于 [tabby-quick-cmds](https://github.com/minyoad/tabby-quick-cmds) 二次开发，保留原作者版权声明。
