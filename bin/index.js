#!/usr/bin/env node
const path = require('path')
const json = require('../package.json');
const commander = require('commander');
const { initProject, createTemplateFIle } = require('../src/template');
const { getFilesContent, getFilePath, createFile, getJSON, getJSONByRange } = require('../src/utils');
const { outputJson, outPutMarkdown, outPutReport } = require('../src/output');
const { writeFileSync } = require('fs');

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
    .option('-M, --month [date]', 'One month')
    .option('-Y, --year [date]', 'One year')
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
        if (createTemplateFIle(cwd, filename)) {
            console.log(`${filename} 创建成功`);
            return
        }
        console.log(`${filename} 已存在`);
    })

/**
 * 创建任务、切换任务、查看任务列表
 */
commander.command("task [name]")
    .alias('t')
    .description('check tasks/add task/checkout task')
    .action((name) => {
        const config = require(configPath)
        const { tasks, defaultTaskIdx } = config
        const idx = tasks.findIndex(v => v === name)
        if(!name){
            if(tasks.length===0){
                console.log('no tasks, you can use command add task');
                console.log('timec task [name]');
                return 
            }
            tasks.forEach((v,i)=>{
                let mark = '[ ]'
                if(i===+defaultTaskIdx){
                    mark = '[*]'
                }
                console.log(mark,v);
            })
            return
        }
        if (idx === -1) {
            tasks.push(name)
            if(tasks.length===1){
                config.defaultTaskIdx = 0
            }
            console.log('add task success');
        }else{
            config.defaultTaskIdx = idx
            console.log('now use task：',tasks[idx]);
        }
        writeFileSync(configPath,JSON.stringify(config))
    })

commander.parse(process.argv)