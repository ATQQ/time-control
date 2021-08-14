const { getConfig, getCWD, updateConfig, getFilePath } = require("../utils")
const { existsSync } = require('fs')
const cwd = getCWD()

module.exports = function (newFilepath) {
    const { recordFilepath } = getConfig()
    if (!newFilepath) {
        console.log(recordFilepath ? `recordFilepath: ${recordFilepath}` : 'not set recordFilepath');
        return
    }
    const fullPath = getFilePath(cwd,newFilepath)
    if (!existsSync(fullPath)) {
        // 自动创建空文件
        createFile(fullPath, '', false)
    }
    console.log('set recordFilePath success：', fullPath);
    updateConfig({
        recordFilepath:fullPath
    })
}