import pgdb from '../config/postgres.db';

export class User {
    constructor(data) {
        if (data.id) this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.name = data.name;
    }

    static database() {
        return 'clean.user';
    }
}
export class UserDAO {
    static async insert(data) {
        const userData = new User(data);
        const key = Object.keys(userData);
        const result = await pgdb.any(
            `INSERT INTO ${User.database()} (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
            key.map(i => userData[i])
        );
        return result;
    };

    static async queryUsers(page, pageSize, username) {
        let sql;
            sql = `SELECT * FROM ${User.database()}
                    WHERE username='${username}' 
                    ORDER BY id DESC LIMIT ${pageSize} OFFSET ${pageSize*(page-1)}`
        let result = await pgdb.query(sql);
        console.log(result);
        return result;
    };

    static async update(data) {
        let fields = Object.keys(data);
        let value = [...Array(fields.length).keys()].map((_, i) => "$" + (i + 1));
        let item = [];
        for (let i = 0; i < fields.length; i++) {
            item.push(`${fields[i]}=${value[i]}`);
        }
        let result = await pgdb.query(`UPDATE ${User.database()} SET ${item.toString()} WHERE id=${data.id}`,
            fields.map(key => data[key])
        );
        return result;
    }

    static async delete(id) {
        let result = await pgdb.query(`DELETE FROM ${User.database()} WHERE id = ${id}`);
        return result;
    }

    static async getByName(username) {
        let result = await pgdb.query(
            `SELECT * FROM ${User.database()} WHERE username='${username}'`,
        );
        return result[0];
    }

    static async getUsersCount(query) {
        let fields = Object.keys(query || {});
        let count = await pgdb.query(`SELECT COUNT(*) FROM ${User.database()}`)
        return count
    }
};
