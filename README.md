# 时间管理工具

生成自己的时间管理报告

## 构思
通过简单的交互指令，分析特定的格式md或md集合，生成报告（周报，月报，年报，自定义周期报告）

## 规划
* [ ] 指令+参数交互生成简单的md报告
* [ ] 接入一些工程工具

## md编写规范
```markdown
# 2020-12-23
## 任务1
* a组件 0.2
* b组件 0.3

## 任务2
* 熟悉代码 0.1
* 学习xx使用 0.2

## 其它
* 学习Vue 0.1
* 写笔记 0.1
```

## 开发指南
### 克隆本仓库
```sh
git clone https://github.com/ATQQ/time-control.git

cd time-control
```

### 安装依赖
```sh
npm install
```

### 创建软连接
```sh
npm link
```

## 使用
```sh
timec [options] [command]
```

### 指令
|          Command          |        Description        |
| :-----------------------: | :-----------------------: |
| init  \| i \<projectName> |       init project        |
| create \|  c \<filename>  | create template note file |

... 不断开发完善中
