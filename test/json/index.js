const fs = require('fs')

const path = require('path')

const testData = fs.readFileSync(path.relative(__dirname, 'test.md'), { encoding: 'utf-8' })

const { getJSON } = require('../../src/utils')


fs.writeFileSync(path.resolve(__dirname, 'test.json'), JSON.stringify(getJSON(testData)), { encoding: 'utf-8' })
