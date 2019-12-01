require("pidcrypt/seedrandom");

const pidCrypt = require("pidcrypt");
require("pidcrypt/aes_cbc");
const aes = new pidCrypt.AES.CBC();

const key = ['I', 'WANT', 'TO', 'SAY', 'THAT', 'NO', 'ONE', 'WILL', 'GET', 'THE', 'TOKEN'];

const getName = (index) => `hash${index}gg_wp`;

export class Token{

    static setToken(data){
        const lengthCount = Math.ceil(data.length / key.length);
        const reg = new RegExp(`.{1,${lengthCount}}`, "g");
        const array = data.match(reg);
        this.clearStorageData();
        array.forEach((item, index) => {
            const encrypted = aes.encryptText(item, key[index]);
            localStorage.setItem(getName(index), encrypted);
        });
        return localStorage.setItem('data', JSON.stringify(data));
    }

    static getToken(){
        let str = '';
        key.forEach((item, index) => {
            const part = localStorage.getItem(getName(index));
            if(part) {
                str += aes.decryptText(part, key[index]);
            }
        });
        return str;
    }

    static clearStorageData(){
        return localStorage.clear();
    }
}

