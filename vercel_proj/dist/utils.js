"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const MAX_LEN = 6;
function generate() {
    let ans = "";
    const subset = "1234567890qwertzuiopasdfghjklyxcvbnm";
    for (let i = 0; i < MAX_LEN; i++) {
        ans += subset[Math.floor(Math.random() * subset.length)]; //storing random index of subset in ans
    }
    return ans;
}
exports.generate = generate;
