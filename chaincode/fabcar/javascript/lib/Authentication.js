/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Authentication extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const users = [
            {
                id: '0',
                username: 'John Smith',
                type: 'Cash',
                InvestValue: '1000000',
            },
            {
                id: '1',
                username: 'Frederic Ansen',
                type: 'Asset',
                InvestValue: '5600000',
            },
        ];

        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'user';
            await ctx.stub.putState('USER' + i, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async createUser(ctx, id, username, type, InvestValue) {
        /*
            # Adds a new user to the blockchain
            # Operation will fail if 'id' belongs to an exisiting user
        */

        console.info('============= CHECK User doesnt exist ===========\n');

        const key = 'USER' + id;
        const userAsBytes = await ctx.stub.getState(key); // get the user from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            console.info('============= START : Create User ===========\n');
            const user = {
                id,
                username,
                type,
                InvestValue,
                docType:'user',
            };

            await ctx.stub.putState('USER'+id, Buffer.from(JSON.stringify(user)));
            console.info('============= END : Create User ===========');
        }
        else {
            console.error('EXISTING USER FOUND - couldnt create new user');
        }
    }

    async queryUserExist(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId); // get the user from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            return 'false';
        }
        console.log(userAsBytes.toString());
        return 'true';
    }

    async queryUser(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId); // get the user from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userId} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async queryAllUsers(ctx) {
        const startKey = 'USER0';
        const endKey = 'USER999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;

                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = Authentication;
