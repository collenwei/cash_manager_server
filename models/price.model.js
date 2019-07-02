import pgdb from '../config/postgres.db.js';
import moment from 'moment';
export class Price {
	constructor(data) {
		if(data.id) this.id = data.id;
		this.customer_id = data.customer_id;
		this.goods_id = data.goods_id;
		this.price = data.price;
		this.update_time = new Date();
		this.create_time = new Date();
		this.isdeleted = false;
	}
	static database() {
		return 'clean.price';
	}
}

export class PriceDAO {
	static async insert(data) {
		const price = new Price(data);
		const key = Object.keys(price);
		const result = await pgdb.any( 
			`INSERT INTO ${Price.database()} (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
            key.map(i => price[i])
        );
        return result;
	}

	static async price(customer_id, goods_id, price) {
		let update_time = moment(new Date()).format('YYYY-MM-DD');
		const result = await pgdb.any(`UPDATE ${Price.database()} SET price=${price}, update_time='${update_time}'::date WHERE customer_id=${customer_id} AND goods_id=${goods_id}`)
		return result;
	}

	static async delete(id) {
		let result = await pgdb.any(`UPDATE ${Price.database()} SET isdeleted=true WHERE id=${id}`)
		return result;
	}

	static async deletecustomer(id) {
		let result = await pgdb.any(`UPDATE ${Price.database()} SET isdeleted=true WHERE customer_id=${id}`)
		return result;
	}

	static async getPrice(customer_id, goods_id) {
		let result = await pgdb.any(`SELECT * FROM ${Price.database()} WHERE goods_id=${goods_id} AND customer_id=${customer_id} AND isdeleted=false`);
		return result;
	}

	static async exist(goods_id, customer_id) {
		let result = await pgdb.any(`SELECT * FROM ${Price.database()} WHERE goods_id=${goods_id} AND customer_id=${customer_id} AND isdeleted=false`);
		return result.length;
	}

	static async getPriceList(customer_id) {
		let result = await pgdb.any(`SELECT goods_id, b.goods_name as goods_name FROM ${Price.database()}
			LEFT JOIN clean.good as b on ${Price.database()}.goods_id = b.id
			WHERE customer_id=${customer_id} AND isdeleted=false`);
		return result;
	}

	static async count(customer_id, goods_ids) {
		let result = await pgdb.any(`SELECT COUNT(*) FROM ${Price.database()} 
			WHERE customer_id=${customer_id} AND goods_id in (${[...Array(goods_ids.length).keys()].map((_, i)=>"$"+(i+1))})`, goods_ids);
		return result[0].count;
	}

	static async markprices(customer_id, ids) {
		await pgdb.any(`UPDATE ${Price.database()} SET isdeleted=false 
			WHERE customer_id=${customer_id} AND goods_id IN (${[...Array(ids.length).keys()].map((_, i)=>"$"+(i+1))})`, ids);
		await pgdb.any(`UPDATE ${Price.database()} SET isdeleted=true 
			WHERE customer_id=${customer_id} AND goods_id NOT IN (${[...Array(ids.length).keys()].map((_, i)=>"$"+(i+1))})`, ids);
		return {};
	}
}