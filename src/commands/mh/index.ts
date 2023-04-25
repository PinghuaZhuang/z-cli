import inquirer from 'inquirer';
import zilong from './zilong';

export default function () {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'code',
        message: '请输入礼拜码:',
      },
    ])
    .then(async ({ code }) => {
      return zilong(code);
    });
}
