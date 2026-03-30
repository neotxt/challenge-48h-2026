const { Pool } = require('pg');

class Database {
    constructor() {
        if (Database.instance) return Database.instance;
        
        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'ynov_community',
            password: 'Bzmq1234',
            port: 5432,
        });

        Database.instance = this;
    }

    async query(text, params) {
        return this.pool.query(text, params);
    }
}

module.exports = new Database();