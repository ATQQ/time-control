const { outputJson, outPutMarkdown } = require('./../output')
const { getJSON, getCWD, getConfig, getOutFilename, getFilesContent, createFile, getFilePath } = require('./../utils')
const cwd = getCWD()
const outFilename = getOutFilename()
const {existsSync} = require('fs')

module.exports = function (filenames, cmdObj) {
    const config = getConfig()
    const { recordFilepath } = config
    if (filenames.length === 0 && !existsSync(recordFilepath)) {
        console.log(`${recordFilepath} is not exist`);
        console.log('you can use "timec upPath <recordFilepath>" set it');
        return
    }
    
    // 获取所有文件的内容
    const content = getFilesContent(filenames.length === 0 ? [recordFilepath] : filenames.map(filename => {
        return getFilePath(cwd, filename)
    }))
    const { json, markdown, time } = cmdObj

    if (json) {
        createFile(getFilePath(cwd, `${outFilename}.json`), outputJson(content), false)
        console.log('导出json成功');
    }
    if (markdown) {
        createFile(getFilePath(cwd, `${outFilename}.md`), outPutMarkdown(getJSON(content), time), false)
        console.log('导出markdown成功');
    }
}