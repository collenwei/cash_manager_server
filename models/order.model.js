import pgdb from '../config/postgres.db.js';

export class Order {
	constructor(data) {
		if(data.id) this.id = data.id;
		this.customer_id = data.customer_id;
		this.goods_id = data.goods_id;
		this.price = data.price;
		this.number = data.number;
		this.order_date = data.order_date;
		this.isdeleted = false;
	}
	static database() {
		return 'clean.order';
	}
}

export class OrderDAO {
	static async insert(data) {
		const order = new Order(data);
		const key = Object.keys(order);
		const result = await pgdb.any( 
			`INSERT INTO ${Order.database()} (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
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
        let result = await pgdb.query(`UPDATE ${Order.database()} SET ${item.toString()} WHERE id=${id}`,
            fields.map(key => data[key])
        );
        return result;
	}

	static async search(body) {
		let result = await pgdb.any(`SELECT * FROM ${Order.database()} WHERE isdeleted=false AND 
			${body.customer_id? ('customer_id='+body.customer_id):'1=1'} ORDER BY id DESC LIMIT ${body.pageSize} OFFSET ${body.pageSize*(body.page-1)}`);
		return result;
	}

	static async getOrder(customer_id, goods_id, date) {
		console.log(`SELECT * FROM ${Order.database()} WHERE isdeleted=false AND customer_id=${customer_id} AND goods_id=${goods_id} AND order_date::date='${date}'::date`)
		let result = await pgdb.any(`SELECT * FROM ${Order.database()} WHERE isdeleted=false AND customer_id=${customer_id} AND goods_id=${goods_id} AND order_date::date='${date}'::date`)
		return result;
	}

	// static async getOrder(orderids) {
	// 	let result = await pgdb.any(`SELECT * FROM ${Order.database()}`)
	// }

	static async getOrderIds(customer_id, date) {
		let result = await pgdb.any(`SELECT id FROM ${Order.database()} WHERE isdeleted=false AND customer_id=${customer_id} AND order_date::date='${date}'::date `)
		return result;
	}
}