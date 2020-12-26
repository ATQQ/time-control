#!/usr/bin/env node
const path = require('path')
const json = require('../package.json');
const commander = require('commander');
const { initProject, createTemplateFIle } = require('../src/template');

// 命令执行目录
const cwd = process.cwd()

commander.version(json.version)

// commander.arguments('<fileName...>')
//     .option('-f, --file <path>', 'the path of directory which the new file belong to ')
//     .option('-d, --all ')
//     .action((filenames, cmdObj) => {
//         console.log(filenames);
//     })

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