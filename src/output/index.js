const { getJSON, getFileContent } = require("../utils")
const { writeFileSync } = require('fs')
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function outputJson(content) {
    return JSON.stringify(getJSON(content))
}

function outPutMarkdown(jsonSchema, withTime = false) {
    // 从小到大排
    jsonSchema = jsonSchema.sort((a, b) => {
        const d1 = new Date(a.title)
        const d2 = new Date(b.title)
        return d1 - d2
    })
    const res = []
    res.push(...getEverydayData(jsonSchema, withTime))
    return res.join('\n')
}

function outPutReport(jsonSchema) {
    const res = []
    let sumTime = 0
    const startDate = jsonSchema[0].title
    const endDate = jsonSchema[jsonSchema.length - 1].title
    // 时间
    res.push(`# ${startDate} 至 ${endDate}`)

    // 过滤出所有的tasks
    const allTasks = jsonSchema.reduce((pre, current) => {
        return pre.concat(current.tasks)
    }, [])

    // 合并相同的任务
    const tasks = allTasks.reduce((pre, current) => {
        if (pre.length === 0) {
            pre.push(current)
            return pre
        }
        let sameTask = pre.find(v => v.title === current.title)
        if (!sameTask) {
            pre.push(current)
            return pre
        }
        sameTask.things.push(...current.things)
        return pre
    }, [])

    for (const taskItem of tasks) {
        res.push('')
        res.push(`## ${taskItem.title}`)
        let taskTime = 0
        let things = taskItem.things.map(thing => {
            const { time, content } = thing
            taskTime += (+time)
            return `* ${content}`
        })
        res.push(`>耗时：${taskTime.toFixed(2)}`)
        res.push(...things)
        sumTime += taskTime
    }
    res.splice(1, 0, `**总耗时** ${sumTime.toFixed(2)}`)
    return res.join('\n')
}

function printDataByTask(timeDes) {
    const tasks = timeDes.reduce((pre, oneDay) => {
        const { tasks } = oneDay
        if (pre.length === 0) {
            pre = tasks
        } else {
            for (const task of tasks) {
                const { title, things } = task
                const _index = pre.findIndex(v => v.title === title)
                if (_index !== -1) {
                    pre[_index].things.push(...things)
                } else {
                    pre.push(task)
                }
            }
        }
        return pre
    }, [])
    tasks.forEach(task => {
        const { title, things } = task
        const sum = things.reduce((pre, cuur) => {
            return pre + (+cuur.time)
        }, 0)
        console.log(`${sum.toFixed(2)} -- ${title}`);
        things.forEach((thing) => {
            const { content, time } = thing
            console.log(`--- ${time} ${content}`);
        })
        console.log('');
    })
}
function fixedNum(num, length = 2) {
    return (+num).toFixed(length)
}

function getEverydayData(timeDesc, withTime = false) {
    let res = []
    // 按天任务时间汇总
    timeDesc.forEach(oneDay => {
        const _oneRes = []
        const { title, tasks } = oneDay
        const sum = tasks.reduce((pre, task, _i) => {
            const { title, things } = task
            const sum = things.reduce((pre, thing) => {
                // 某件事情况
                const { content, time } = thing
                _oneRes.unshift(`* ${content} -- ${fixedNum(time)}`)
                return pre + (+thing.time)
            }, 0)

            // 某一个任务
            _oneRes.unshift(`## ${title} -- ${fixedNum(sum)}`)
            return pre + sum
        }, 0)

        // 一天的标题
        _oneRes.unshift(`# ${title} -- ${fixedNum(sum)}`)
        res.push(..._oneRes, '')
    })
    // 去掉统计的时间
    if (!withTime) {
        res = res.map(v => {
            return v.replace(/\s--.*/, '')
        })
    }
    return res
}

function writeRecord(filePath, task, thing, startTime) {
    const json = getJSON(getFileContent(filePath))
    const date = new Date(startTime)
    const title = date.format('yyyy-MM-dd')
    const dayIdx = json.findIndex(v => v.title === title)
    const hours = ((Date.now() - date.getTime()) / 3600000).toFixed(5)
    // 当天的首个数据
    if (dayIdx === -1) {
        const item = {
            title,
            tasks: [
                {
                    title: task,
                    things: [
                        {
                            content: `${thing} ${hours}`,
                            time: '0'
                        }
                    ]
                }
            ]
        }
        json.push(item)
        return writeFileSync(filePath, outPutMarkdown(json, false))
    }
    const dataItem = json[dayIdx]
    const taskIdx = dataItem.tasks.findIndex(v => v.title === task)
    // 新的任务
    if (taskIdx === -1) {
        dataItem.tasks.push({
            title: task,
            things: [
                {
                    content: `${thing} ${hours}`,
                    time: '0'
                }
            ]
        })
        return writeFileSync(filePath, outPutMarkdown(json, false))
    }
    const taskItem = dataItem.tasks[taskIdx]
    taskItem.things.push({
        content: `${thing} ${hours}`,
        time: '0'
    })
    
    // TODO 特殊处理,元数据content不带time
    // const things = json.reduce(v=>{
    //     return 
    // },[])
    console.log(outPutMarkdown(json, false));
    // return writeFileSync(filePath, outPutMarkdown(json, false))
}
module.exports = {
    outputJson,
    outPutMarkdown,
    outPutReport,
    writeRecord
}