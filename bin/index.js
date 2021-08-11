#!/usr/bin/env node
const path = require('path')
const json = require('../package.json');
const commander = require('commander');
const { initProject, createTemplateFile } = require('../src/template');
const { getFilesContent, getFilePath, createFile, getJSON, getJSONByRange, mmsToNormal } = require('../src/utils');
const { outputJson, outPutMarkdown, outPutReport, writeRecord } = require('../src/output');
const { writeFileSync, existsSync } = require('fs');

// 命令执行目录
const cwd = process.cwd()

// 配置文件目录
const configPath = path.join(__dirname, '../.config/record.json')
// 设置版号
commander.version(json.version)

// 导出
commander.arguments('<filenames...>') // 多个文件/目录
    .option('-o, --output', 'Export analysis results')
    .option('-j, --json', 'Export result as json description file')
    .option('-m, --markdown', 'Export the result as a markdown file')
    .option('-t, --time', 'Export the result with time')
    .option('-p, --page', 'Export the result as a page')
    .option('-r, --report', 'Export the result as a md report')
    .option('-D, --day [date]', 'One day')
    .option('-M, --month [month]', 'One month')
    .option('-Y, --year [year]', 'One year')
    .option('-R, --range [startDate_endDate]', 'A time period')
    .action((filenames, cmdObj) => {
        const { output, json, markdown, time, report } = cmdObj
        // 导出
        if (output) {
            let outFileName = 'res'
            // 后续逻辑

            // 获取所有文件的内容
            const content = getFilesContent(filenames.map(filename => {
                return getFilePath(cwd, filename)
            }))
            if (json) {
                createFile(getFilePath(cwd, `${outFileName}.json`), outputJson(content), false)
            }
            if (markdown) {
                createFile(getFilePath(cwd, `${outFileName}.md`), outPutMarkdown(getJSON(content), time), false)
            }
            if (report) {
                const { day, month, year, range } = cmdObj
                const output = (s, e) => {
                    const outPutPath = getFilePath(cwd, `report-${outFileName}.md`)
                    const json = getJSONByRange(content, s, e)
                    if (json.length === 0) {
                        console.log('没有符合条件的数据');
                        return
                    }
                    const data = outPutReport(json)
                    createFile(outPutPath, data, false)
                    console.log(`导出成功`);
                }
                if (range) {
                    const [startTime, endTime] = range.split('_')
                    return output(startTime, endTime)
                }
                if (day) {
                    return output(day, day)
                }
                if (year && month) {
                    return output(`${year}-${month}-01`, `${year}-${month}-${new Date(year, month, 0).getDate()}`)
                }
                if (year) {
                    return output(`${year}-01-01`, `${year}-12-31`)
                }
                if (month) {
                    const year = new Date().getFullYear()
                    return output(`${year}-${month}-01`, `${year}-${month}-${new Date(year, month, 0).getDate()}`)
                }
            }
        }
    })

/**
 * 初始化项目
 */
commander.command("init <projectName>")
    .alias('i')
    .description('init project')
    .action((projectName) => {
        if (initProject(cwd, projectName)) {
            console.log(`初始化 ${projectName} 成功`);
            return
        }
        console.log(`${projectName} 已存在`);
    })

/**
 * 创建一个时间记录模板文件
 */
commander.command("create <filename>", {})
    .alias('c')
    .description('create template note file')
    .action((filename) => {
        if (createTemplateFile(cwd, filename)) {
            console.log(`${filename} 创建成功`);
            return
        }
        console.log(`${filename} 已存在`);
    })

/**
 * 创建任务、切换任务、查看任务列表
 */
commander.command("task [name]")
    .option('-d, --del', 'Delete task or thing')
    // .alias('t')
    .description('check tasks/add task/checkout task')
    .action((name, cmdObj) => {
        const config = require(configPath)
        const { tasks, defaultTaskIdx } = config

        const { del } = cmdObj
        const idx = tasks.findIndex(v => v === name)
        if (!name) {
            if (tasks.length === 0) {
                console.log('no tasks, you can use command add task');
                console.log('timec task [name]');
                return
            }
            tasks.forEach((v, i) => {
                let mark = '[ ]'
                if (i === +defaultTaskIdx) {
                    mark = '[*]'
                }
                console.log(mark, v);
            })
            return
        }
        if (idx === -1) {
            if (del) {
                console.log(`${name} not exist!!!`);
                return
            }
            tasks.push(name)
            if (tasks.length === 1) {
                config.defaultTaskIdx = 0
            }
            console.log(`add task（${name}）success`);
        } else {
            if (del) {
                tasks.splice(idx, 1)
                console.log(`del ${name} success`);
                config.defaultTaskIdx = defaultTaskIdx >= idx ? defaultTaskIdx - 1 : defaultTaskIdx
                if (config.defaultTaskIdx >= 0) {
                    console.log('now use task:', tasks[config.defaultTaskIdx]);
                }
            } else {
                config.defaultTaskIdx = idx
                console.log('now use task:', tasks[idx]);
            }
        }
        writeFileSync(configPath, JSON.stringify(config))
    })

/**
 * 更改默认记录文件的位置
 */
commander.command("upPath <recordFilepath>")
    // .alias('urp')
    .description('update config recordFilepath')
    .action((recordFilePath) => {
        const config = require(configPath)
        const fullPath = path.resolve(cwd, recordFilePath)
        config.recordFilepath = fullPath
        if (!existsSync(fullPath)) {
            // 自动创建空文件
            createFile(fullPath, '', false)
        }
        writeFileSync(configPath, JSON.stringify(config))
        console.log('set recordFilePath success：', fullPath);
    })

/**
 * 开始/结束具体的事务
 */
commander.command("thing [name]")
    .option('-s, --stop', 'stop a thing ')
    .description('update config recordFilepath')
    .action((name, cmdObj) => {
        const config = require(configPath)
        const { thing, recordFilepath, tasks, defaultTaskIdx } = config
        const task = tasks[defaultTaskIdx]
        const s = new Date(thing.startTime)

        if (!existsSync(recordFilepath)) {
            console.log(`${recordFilepath} is not exist`);
            console.log('you can use "timec upPath <recordFilepath>" set it');
            return
        }
        if (!task) {
            console.log('not set task');
            console.log('you can use "timec task [name]" set it');
            return
        }

        if (!name) {
            if (!thing.name) {
                console.log('Events not in progress');
                return
            }
            const { stop } = cmdObj
            if (stop) {
                // log上一个任务耗时
                console.log('---finish thing---');
                console.log(`* name:     ${thing.name}`);
                console.log(`* start:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
                console.log(`* duration: ${mmsToNormal(Date.now() - s)}`);
                console.log('------------------');
                writeRecord(recordFilepath, task, thing.name, thing.startTime)
                thing.name = ''
                thing.startTime = ''
                writeFileSync(configPath, JSON.stringify(config))
                return
            }
            console.log('------------------');
            console.log(`* name:     ${thing.name}`);
            console.log(`* start:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
            console.log(`* duration: ${mmsToNormal(Date.now() - s)}`);
            console.log('------------------');
            return
        }

        if (thing.name) {
            // log上一个任务耗时
            console.log('---finish thing---');
            console.log(`* name:     ${thing.name}`);
            console.log(`* start:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
            console.log(`* duration: ${mmsToNormal(Date.now() - s)}`);
            console.log('------------------');
            // 记录到文件中
            writeRecord(recordFilepath, task, thing.name, thing.startTime)
        }

        thing.name = name
        thing.startTime = new Date().getTime()

        console.log('-----new thing----');
        console.log(`* name:     ${thing.name}`);
        console.log(`* start:    ${new Date().format('yyyy-MM-dd hh:mm:ss')}`);
        console.log('------------------');

        writeFileSync(configPath, JSON.stringify(config))
    })

commander.parse(process.argv)