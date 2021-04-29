const inquirer = require('inquirer');
const $console = require('Console');
const jsome = require('jsome');


module.exports = {
    async choices(title, options) {
        return await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'choice',
                message: title,
                choices: options,
            }
        ]).then((answer) => {
            let index = 0;
            for (let i in options) {
                if (options[i] == answer.choice) {
                    index = parseInt(i) + 1;
                    break;
                }
            }
            return index;
        }).catch(() => {
            return -1;
        });
    },
    async prompt(title, inputList){
        this.info(title);
        for (let i in inputList) {
            inputList[i].type = 'input';
        }
        return await inquirer.prompt(inputList).then((answer) => {
            return answer;
        }).catch(() => {
            return -1;
        });
    },
    async confirm(title){
        return await inquirer.prompt([{
            message:title,
            name:'confirm',
            type:'confirm',
            default:false
        }]).then((answer) => {
            return answer.confirm;
        }).catch(() => {
            return false;
        });
    },
    success(str, exist = false) {
        $console.success(str);
        exist && process.exit(1);
    },
    error(str, exist = false) {
        $console.error(str);
        exist && process.exit(1);
    },
    warn(str, exist= false) {
        $console.warn(str);
        exist && process.exit(1);
    },
    info(str, exist= false) {
        $console.debug(str);
        exist && process.exit(1);
    },
    print(obj) {
        jsome(obj);
    }
}