import pgdb from '../config/postgres.db.js';

export class Orders {
	constructor(data) {
		if(data.id) this.id = data.id;
		this.customer_id = data.customer_id;
		this.date = data.date;
		this.orders = data.orders;
		this.total = data.total;
		this.remark = data.remark;
		this.isdeleted = false;
	}
	static database() {
		return 'clean.orders';
	}
}

export class OrdersDAO {
	static async insert(data) {
		const order = new Orders(data);
		const key = Object.keys(order);
		const result = await pgdb.any( 
			`INSERT INTO ${Orders.database()} (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
            key.map(i => order[i])
        );
        return result;
	}

	static async update(data, id) {
		let fields = Object.keys(data);
		//todo:安全风险限制修改内容
        let value = [...Array(fields.length).keys()].map((_, i) => "$" + (i + 1));
		let item = [];
		for (let i = 0; i < fields.length; i++) {
            item.push(`${fields[i]}=${value[i]}`);
        }
        let result = await pgdb.query(`UPDATE ${Orders.database()} SET ${item.toString()} WHERE id=${id}`,
            fields.map(key => data[key])
        );
        return result;
	}

	static async getOrders(customer_id, date) {
		let result = await pgdb.query(`SELECT * FROM ${Orders.database()} WHERE customer_id=${customer_id} AND date::date='${date}'::date`);
		return result;
	}

	static async query(customer_id, page, pageSize, start_date, end_date) {
		let sql = `SELECT * FROM ${Orders.database()} WHERE ${customer_id ? `customer_id=${customer_id}`: '1=1' } AND COALESCE(date, '2200-01-01')::date >= ('${(start_date||'1900-01-01')}')::date 
                AND COALESCE(date, '1900-01-01')::date <= ('${(end_date||'2200-01-01')}')::date ORDER BY id DESC LIMIT ${pageSize} OFFSET ${pageSize*(page-1)} `
        console.log('see the sql', sql);
		let result = await pgdb.query(sql);
		return result;
	}
}