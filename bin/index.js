#!/usr/bin/env node
const path = require('path')
const json = require('../package.json');
const commander = require('commander');
const { initProject, createTemplateFIle } = require('../src/template');
const { getFilesContent, getFilePath, createFile, getJSON } = require('../src/utils');
const { outputJson, outPutMarkdown } = require('../src/output');

// 命令执行目录
const cwd = process.cwd()

// 设置版号
commander.version(json.version)

// 导出
commander.arguments('<filenames...>') // 多个文件/目录
    .option('-o, --output', 'Export analysis results')
    .option('-j, --json', 'Export result as json description file')
    .option('-m, --markdown', 'Export the result as a markdown file')
    .option('-t, --time', 'Export the result with time')
    .option('-p, --page', 'Export the result as a page')
    .option('-D, --day [date]', 'One day')
    .option('-W, --week [date]', 'One week')
    .option('-M, --month [date]', 'One month')
    .option('-Y, --year [date]', 'One year')
    .option('-R, --range [startDate] [endDate]', 'A time period')
    .action((filenames, cmdObj) => {
        const { output, json, markdown, time } = cmdObj

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
                createFile(getFilePath(cwd, `${outFileName}.md`), outPutMarkdown(getJSON(content),time), false)
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
commander.command("create <filename>")
    .alias('c')
    .description('create template note file')
    .action((filename) => {
        if (createTemplateFIle(cwd, filename)) {
            console.log(`${filename} 创建成功`);
            return
        }
        console.log(`${filename} 已存在`);
    })

commander.parse(process.argv)