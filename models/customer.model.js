import pgdb from '../config/postgres.db.js';

export class Customer {
	constructor(data) {
		if(data.id) this.id = data.id;
		this.customer_name = data.customer_name;
		this.customer_address = data.customer_address;
		this.customer_contact = data.customer_contact;
		this.customer_remark = data.customer_remark;
		this.customer_uid = data.customer_uid;
		this.isdeleted = false;
	}
	static database() {
		return 'clean.customer';
	}
}

export class CustomerDAO {
	static async insert(data) {
		const customer = new Customer(data);
		const key = Object.keys(customer);
		const result = await pgdb.query( 
			`INSERT INTO ${Customer.database()} (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
            key.map(i => customer[i])
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
        let result = await pgdb.query(`UPDATE ${Customer.database()} SET ${item.toString()} WHERE id=${id}`,
            fields.map(key => data[key])
        );
        return result;
	}

	static async delete(id) {
		let result = await pgdb.any(`UPDATE ${Customer.database()} SET isdeleted=true WHERE id=${id}`)
		return result;
	}

	static async getCustomer(id) {
		console.log(`SELECT * FROM ${Customer.database()} WHERE ${id ? `id=${id}`: `1=1`}`)
		let result = await pgdb.any(`SELECT * FROM ${Customer.database()} WHERE isdeleted=false AND ${id ? `id=${id}`: `1=1`}`)
		return result;
	}

	static async getCustomerByUid(uid) {
		let result = await pgdb.any(`SELECT * FROM ${Customer.database()} WHERE isdeleted=false AND customer_uid='${uid}'`)
		return result;
	}

	//不够抽象化
	static async search(body) {
		let result = await pgdb.any(`SELECT * FROM ${Customer.database()} WHERE isdeleted=false AND 
			${body.customer_name? (`customer_name='${body.customer_name}'`):'1=1'} AND ${body.customer_id? (`id=${body.customer_id}`):'1=1'}  ORDER BY id DESC LIMIT ${body.pageSize||10} OFFSET ${(body.pageSize||10)*((body.page||1)-1)}`);
		return result;
	}
}
