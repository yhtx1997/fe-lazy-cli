'use strict';

module.exports = core;

// 官包
const path = require('path');

// 外包
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;

// 自包
const log = require('@fe-lazy-cli/log');
const pkg = require('../package.json');
const { getNpmSemverVersion } = require('@fe-lazy-cli/get-npm-info');

const constant = require('./const');

let args = null,
    config = null;

async function core() {
    try {
        // 检查包版本号
        checkPkgVersion();
        // 检查 node 版本号
        checkNodeVersion();
        // root 降级
        checkRoot();
        // 检查主目录
        checkUserHome();
        // 检查入参
        checkInputArgs();
        // 检查环境变量
        checkEnv();
        // 检查更新
        await checkGlobalUpdate();
    } catch (error) {
        log.error(colors.red(error.message));   
    }
    
}

async function checkGlobalUpdate() {
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    const lastVersion = await getNpmSemverVersion(currentVersion, 'webpack-cli');
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn(colors.yellow(`最新版本号：${lastVersion} 请使用 npm install -g ${npmName} 更新版本！ 获得更好的使用体验！`));
    }
}

function checkEnv() {
    const dotEnv = require('dotenv');
    const dotEnvPath = path.resolve(userHome);
    if (pathExists(dotEnvPath)) {
        config = dotEnv.config({
            path: dotEnvPath
        });
    }
    createDefaultConfig();
    log.verbose('环境变量', config);
}

function createDefaultConfig() {
    const cLiConfig = {};
    if (process.env.FE_LAZY_CLI_HOME) {
        cLiConfig['feLazyCliHome'] = path.join(userHome, process.env.FE_LAZY_CLI_HOME);
    } else {
        cLiConfig['feLazyCliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.FE_LAZY_CLI_HOME = cLiConfig.feLazyCliHome;
}

function checkInputArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    checkArgs();
    log.verbose('debug', 'test deubug level');
}

function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error('当前用户主目录不存在！');
    }
}

function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck();
}

function checkNodeVersion() {
    const currentNodeVersion = process.version;
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    if(semver.lt(currentNodeVersion, lowestVersion)) {
        throw new Error( colors.red(`需要安装 ${lowestVersion} 及以上版本的 node`));
    }
}

function checkPkgVersion() {
    log.info(`当前版本号：${pkg.version}`);
}
