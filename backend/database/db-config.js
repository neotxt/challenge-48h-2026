import pkg from 'pg';
const { Pool } = pkg;

class Database {
    constructor() {
        if (Database.instance) return Database.instance;

        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'ynov_community',
            password: 'Neo3379!',
            port: 5432,
        });

        Database.instance = this;
    }

    // Cette méthode permet d'exécuter des requêtes SQL
    async query(text, params) {
        return this.pool.query(text, params);
    }
}

const dbInstance = new Database();
export default dbInstance;