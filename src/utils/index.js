const fs = require('fs')

/**
 * 获取md文件的JSON描述
 * @param {string} fileContent 
 */
function getJSON(fileContent) {
    const lines = fileContent.split('\n')
    const resData = []
    let item = null
    for (const line of lines) {
        // 判断是否新的一天
        if (line.startsWith('# ')) {
            // 存储旧的
            if (item) {
                resData.push(item)
            }

            const title = line.replace(/#|\s/g, '')
            item = {
                title,
                tasks: []
            }
        }

        // 判断是否是任务
        if (line.startsWith('## ')) {
            const title = line.replace(/#|\s/g, '')
            let task = {
                title,
                things: []
            }
            item.tasks.push(task)
        }

        // 判断是否是做的具体事务
        if (line.startsWith('* ')) {
            const task = item.tasks.pop()
            const { things } = task
            const rTime = /((0.\d*)|(\d*))?$/

            const time = line.match(rTime)[0] || '0'
            let step = -1, text = ''
            const content = (step = (text = line.replace(/\*|\s/g, '')).lastIndexOf(time)) === -1 ? text : text.slice(0, step)
            const thing = {
                time,
                content
            }

            things.push(thing)

            item.tasks.push(task)
        }
    }
    if (item && item !== resData[resData.length - 1]) {
        resData.push(item)
    }
    return resData
}

/**
 * 创建一个不存在的目录
 * @param {string} path 
 */
function createDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true })
        return true
    }
    console.error(`${path} 已存在`);
    return false
}


/**
 * 创建一个新文件
 * @param {string} path 
 * @param {string} content 
 */
function createFile(path, content) {
    if(!fs.existsSync(path)){
        fs.writeFileSync(path, content, { encoding: 'utf-8' })
        return true
    }
    console.error(`${path} 已存在`);
    return false
}

/**
 * 获取文件内容
 * @param {string} filepath 
 */
function getFileContent(filepath) {
    return fs.readFileSync(filepath, { encoding: 'utf-8' })
}


module.exports = {
    getJSON,
    createDir,
    getFileContent,
    createFile
}