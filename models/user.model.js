import pgdb from '../../config/postgres.db';

export class User {
    constructor(data) {
        if (data.id) this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.department_id = data.department_id;
        this.name = data.name;
        this.rid = data.rid;
    }
}
export class UserDAO {
    static async insert(data) {
        const userData = new User(data);
        const key = Object.keys(userData);
        const result = await pgdb.any(
            `INSERT INTO access_control.users (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
            key.map(i => userData[i])
        );
        return result;
    };

    static async queryUsers(page, pageSize, username) {
        let sql;
        if (username) {
            sql = `SELECT * FROM access_control.users u 
                    JOIN access_control.role r
                    ON u.rid=r.id
                    LEFT JOIN access_control.departments AS d 
                    ON u.department_id=d.id 
                    WHERE u.username='${username}' 
                    ORDER BY u.id DESC LIMIT ${pageSize} OFFSET ${pageSize*(page-1)}`
        } else {
            sql = `SELECT u.id,u.username,u.name,u.password,u.rid,u.department_id,r.role,d.department,d.department_group 
                    FROM access_control.users u
                    JOIN access_control.role r
                    ON u.rid=r.id
                    LEFT JOIN access_control.departments AS d 
                    ON u.department_id=d.id 
                    ORDER BY u.id DESC LIMIT ${pageSize} OFFSET ${pageSize*(page-1)}`
        }
        let result = await pgdb.query(sql);
        console.log(result);
        return result;
    };

    static async queryUserByRoleId(rid) {
        let result = await pgdb.query(`SELECT * FROM access_control.users WHERE rid=${rid}`)
        return result
    }

    static async queryRoleId(role) {
        let result = await pgdb.query(`SELECT id FROM access_control.role WHERE role='${role}'`);
        return result[0].id;
    }

    static async queryRole() {
        let result = await pgdb.query('SELECT r.id,r.role FROM access_control.role AS r');
        return result;
    };

    static async queryDepartment() {
        let result = await pgdb.query('SELECT d.id,d.department,d.department_group FROM access_control.departments AS d');
        return result;
    };

    static async update(data) {
        let fields = Object.keys(data);
        console.log('see the fields', fields);
        let value = [...Array(fields.length).keys()].map((_, i) => "$" + (i + 1));
        let item = [];
        for (let i = 0; i < fields.length; i++) {
            item.push(`${fields[i]}=${value[i]}`);
        }
        console.log('sql ', `UPDATE access_control.users SET ${item.toString()} WHERE id=${data.id}`)
        let result = await pgdb.query(`UPDATE access_control.users SET ${item.toString()} WHERE id=${data.id}`,
            fields.map(key => data[key])
        );
        return result;
    }

    static async delete(id) {
        let result = await pgdb.query(`DELETE FROM access_control.users WHERE id = ${id}`);
        return result;
    }

    static async getByName(username) {
        let result = await pgdb.query(
            `SELECT u.id,u.username,u.name,u.department_id,u.password,r.role,r.visit FROM access_control.users AS u,access_control.role AS r WHERE u.rid=r.id  AND u.username='${username}'`,
        );
        return result[0];
    }

    static async getUsersCount(query) {
        let fields = Object.keys(query || {});
        let count = await pgdb.query(`SELECT COUNT(*) FROM access_control.users`)
        return count
    }
};
