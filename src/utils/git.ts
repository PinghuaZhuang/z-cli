import path from 'path';
import { execFile } from 'child_process';

/*
git add --all
git commit -m 'update(MH): 武器数据'
git push
*/
export async function commit(msg?: string) {
  return new Promise((resolve, reject) => {
    execFile(
      path.resolve(__dirname, '../../bin/commit.sh'),
      {
        windowsHide: true,
      },
      function (error) {
        if (error) return reject(error);
        resolve(msg ?? '>>> 提交代码.');
      },
    );
  });
}
