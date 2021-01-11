const { getJSON } = require("../utils")
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

function outPutMarkdown(jsonSchema) {
    // 从小到大排
    jsonSchema = jsonSchema.sort((a, b) => {
        const d1 = new Date(a.title)
        const d2 = new Date(b.title)
        return d1 - d2
    })
    printEverydayData(jsonSchema)
    console.log('------------');
    printDataByTask(jsonSchema)
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
function printEverydayData(timeDesc) {
    // 按天任务时间汇总
    timeDesc.forEach(oneDay => {
        const { title, tasks } = oneDay
        console.log(`# ${title}`);
        tasks.forEach(task => {
            const { title, things } = task
            const sum = things.reduce((pre, cuur) => {
                return pre + (+cuur.time)
            }, 0)
            console.log(`## ${sum.toFixed(2)} -- ${title}`);
        })
    })
}
module.exports = {
    outputJson,
    outPutMarkdown
}