import pgdb from '../../config/postgres.db';

export class Customer {
	constructor(data) {
		if(data.id) this.id = data.id;
		this.customer_name = data.customer_name;
		this.customer_address = data.customer_address;
		this.customer_contact = data.customer_contact;
		this.customer_remark = data.customer_remark;
		this.isdeleted = false;
	}
	static database = 'customer';
	static schema = 'clean';
}

export class CustomerDAO {
	static async insert(data) {
		const customer = new Customer(data);
		const key = Object.keys(customer);
		const result = await pgdb.any( 
			`INSERT INTO ${Customer.schema}.${Customer.database} (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
            key.map(i => userData[i])
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
        console.log('sql ', `UPDATE ${Customer.schema}.${Customer.database} SET ${item.toString()} WHERE id=${data.id}`)
        let result = await pgdb.query(`UPDATE ${Customer.schema}.${Customer.database} SET ${item.toString()} WHERE id=${data.id}`,
            fields.map(key => data[key])
        );
        return result;
	}

	static async delete(id) {
		let result = await pgdb.any(`UPDATE ${Customer.schema}.${Customer.database} SET isdeleted=true WHERE id=${id}`)
		return result;
	}

	//不够抽象化
	static async search(body) {
		let result = await pgdb.any(`SELECT * FROM ${Customer.schema}.${Customer.database} WHERE isdeleted=false AND 
			${body.customer_name? ('customer_name='+body.customer_name):'1=1'} ORDER BY id DESC LIMIT ${body.pageSize} OFFSET ${body.pageSize*(body.page-1)}`);
		return result;
	}
}