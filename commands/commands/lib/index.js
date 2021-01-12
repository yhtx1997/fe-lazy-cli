'use strict';

const commander = require('commander');
const colors = require('colors');

const log = require('@fe-lazy-cli/log');
// 获取 commander 的单例
//  const { program } = commander;
// 手动实例化一个 commander
const program = new commander.Command();

function command(pkg) {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage("<command> [option]")
        .version(pkg.version)
        .option('-d, --debug [debugModule]', '是否开启 debug 模式', false)
        .option('-v,  -V, --version', "输出版本信息");
    
    regCommand();
    regAddCommand();

    program.on('command:*',(arg) => {
        let commands = program.commands.map(item => {
            return {
                name: item._name.split(''),
                consistency: 0
            };
        })
        commands = commands.map(item => {
            let argArr = arg[0].split('');
            let consistency = item.consistency
            item.name.map(c => {
                if (argArr.indexOf(c) >= 0) {
                    consistency ++;
                    argArr.splice(argArr.indexOf(c), 1);
                }
            })

            return {
                name: item.name.join(''),
                consistency
            };
        });
        commands = commands.filter(item => item.consistency > 0).sort((a, b) => b.consistency - a.consistency);
        commands = commands && commands.length && commands[0].name || false;
        
        let argText = arg[0] || "";
        if (commands) {
            throw new Error(colors.red(`抱歉！没有找到 '${argText}' 命令. 是否要运行 '${commands}' 命令. 或者运行 '${Object.keys(pkg.bin)[0]} --help' 查看帮助信息！`));
        }
        throw new Error(colors.red(`抱歉！没有找到 '${argText}' 命令. 请运行 '${Object.keys(pkg.bin)[0]} --help' 查看帮助信息！`));
    });
   

    program
        .parse(process.argv);
}

function regCommand() {
    const echo = program.command('echo <envName> [argv]');
    
    echo
        .description('输出当前指令')
        .option('-t, --test', '配置', false)
        .action((envName, argv, option) => {
           log.info('测试输出', envName, argv, option.test);
        })
}

function regAddCommand() {
    const print = new commander.Command('print');
    
    print
        .alias('p')
        .description('输出指定数据')
        .command('int <number>')
        // .command(
        //     'init <number>', 
        //     '描述',  // 添加描述后 执行当前脚手架 + '-init'的脚手架： fe-lazy-cli-init
        //     {
        //         executableFile: 'fe', // 添加选项 执行 fe 脚手架
        //         isDefault: true, // 默认的执行命令
        //         hidden: true // 隐藏命令
        //     }
        // )
        .description('输出整数')
        .option('--hex <hexNumber>', '进制', 10)
        .action((number, option) => {
            log.info(`${option.hex} 进制`, parseInt(number, option.hex));
        });

    program.addCommand(print);
}

module.exports = command;