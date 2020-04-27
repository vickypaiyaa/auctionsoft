'use strict';

module.exports = {
    development: {
        client: 'pg',
        connection : {
            host:'localhost',
            user:'postgres',
            password: 'postgres',
            database: 'test',
            port:5432
        }
    }
};