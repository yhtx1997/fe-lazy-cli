const importLocal = require('import-local');
const log = require('@fe-lazy-cli/log');

if (importLocal(__filename)) {
    log.info('当前正在使用项目内安装版本');
} else {
    log.info('当前正在使用全局安装版本');
    require('../lib')(process.argv.slice(2));
}