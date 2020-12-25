const fs = require('fs')

const path = require('path')
const filepath = process.argv[2]
const testData = fs.readFileSync(filepath, { encoding: 'utf-8' })

const { getJSON } = require('../../src/utils')

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

function printTest(timeDesc) {
    // 取某个日期所在的一周
    const dates = getAWeekDates(new Date())

    // 从小到大排
    timeDesc = timeDesc.filter((oneDay) => {
        return dates.includes(oneDay.title)
    }).sort((a, b) => {
        const d1 = new Date(a.title)
        const d2 = new Date(b.title)
        return d1 - d2
    })

    printEverydayData(timeDesc)
    console.log('------------');
    printDataByTask(timeDesc)
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

/**
 * 获取某日所在的一周的日期
 * @param {Date} oneDate 
 */
function getAWeekDates(oneDate) {
    const oneDay = 1000 * 60 * 60 * 24
    const day = oneDate.getDay()
    let pre, back
    if (day === 0) {
        pre = 6
        back = 0
    } else {
        pre = day - 1
        back = 7 - day
    }
    const dates = []
    while (pre) {
        dates.push(new Date(oneDate.getTime() - oneDay * pre))
        pre--
    }
    while (back) {
        dates.push(new Date(oneDate.getTime() + oneDay * back))
        back--
    }
    dates.push(oneDate)
    return dates.sort((a, b) => a - b).map(v => v.format('yyyy-MM-dd'))
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
            const {content,time} = thing
            console.log(`--- ${time} ${content}`);
        })
        console.log('');
    })
}

printTest(getJSON(testData))