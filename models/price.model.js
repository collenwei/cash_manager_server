import pgdb from '../config/postgres.db.js';

export class Price {
	constructor(data) {
		if(data.id) this.id = data.id;
		this.customer_id = data.customer_id;
		this.good_id = data.good_id;
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
            key.map(i => userData[i])
        );
        return result;
	}

	static async price(customer_id, good_id, price) {
		const result = await pgdb.any(`UPDATE ${Price.database()} SET price=${price} WHERE customer_id=${customer_id} AND good_id=${good_id}`)
		return result;
	}

	static async delete(id) {
		let result = await pgdb.any(`UPDATE ${Price.database()} SET isdeleted=true WHERE id=${id}`)
		return result;
	}

	static async deletecustomer(id) {
		let result = await pgdb.any(`UPDATE ${Price.database()} SET isdeleted=true WHERE customer_id=${customer_id}`)
		return result;
	}

	static async exist(good_id, customer_id) {
		let result = await pgdb.any(`SELECT * FROM ${Price.database()} WHERE good_id=${good_id} AND customer_id=${customer_id}`);
		return result.length;
	}	
}