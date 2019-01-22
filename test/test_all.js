// all tests, in batch form
"use strict";

const Q = require('q');
Q.longStackSupport = true;
process.on('unhandledRejection', (up) => { throw up; });

process.env.TEST_MODE = '1';

async function seq(array) {
    for (let fn of array) {
        console.log(`Running ${fn}`);
        await require(fn)();
    }
}

seq([
    ('./test_send_transaction.js'),
    ('./test_get_info.js'),
    ('./test_empty.js'),
    ('./test_wrong.js')
]);