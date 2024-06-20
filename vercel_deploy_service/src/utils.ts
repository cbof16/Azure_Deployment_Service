import {exec,spawn} from 'child_process';
import path from 'path';

export function buildProject(id:string){
     return new Promise((resolve, reject) => {
        const child = exec(`cd ${path.join(__dirname, `${id}`)} && npm install && npm run build`);
        child.stdout?.on('data', (data) => {
            console.log(data);
        });
        child.stderr?.on('data', (data) => {
            console.error(data);
        });
        child.on('close', (code) => {
            resolve("")
        });
     })}