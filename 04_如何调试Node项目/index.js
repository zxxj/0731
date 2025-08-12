
// 通过os模块拿到home目录的路径
const os = require('os')

const homedir = os.homedir()

console.log(homedir)