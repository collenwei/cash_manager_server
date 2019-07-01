import pgdb from '../config/postgres.db.js';

export class Goods {
	constructor(data) {
		if(data.id) this.id = data.id;
		this.goods_name = data.goods_name;
		this.goods_price = data.goods_price;
		this.goods_remark = data.goods_remark;
		this.isdeleted = false;
	};
	static database() {
		return 'clean.good';
	}
	
}

export class GoodsDAO {
	static async insert(data) {
		const goods = new Goods(data);
		const key = Object.keys(goods);
		const result = await pgdb.any( 
			`INSERT INTO ${Goods.database()} (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
            key.map(i => goods[i])
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
        console.log('sql ', `UPDATE ${Goods.database()} SET ${item.toString()} WHERE id=${id}`)
        let result = await pgdb.query(`UPDATE ${Goods.database()} SET ${item.toString()} WHERE id=${id}`,
            fields.map(key => data[key])
        );
        return result;
	}

	static async delete(id) {
		let result = await pgdb.any(`UPDATE ${Goods.database()} SET isdeleted=true WHERE id=${id}`)
		return result;
	}

	//不够抽象化
	static async search(body) {
		// let goods_name = body.goods_name? ('goods_name='+body.goods_name):'1=1';
		let result = await pgdb.any(`SELECT * FROM ${Goods.database()} WHERE isdeleted=false AND 
			${body.goods_name? (`goods_name='${body.goods_name}'`):'1=1'} ORDER BY id DESC`);
		return result;
	}

	static async getList() {
		let result = await pgdb.any(`SELECT * FROM ${Goods.database()} WHERE isdeleted=false `);
		return result;
	}

	static async getGoods(id) {
		let result = await pgdb.any(`SELECT * FROM ${Goods.database()} WHERE id=${id} `);
		return result;
	}
	// static async getGoodssList(body) {
	// 	let result = await pgdb.any(`SELECT * FROM ${Goods.database()} WHERE isdeleted=false AND 
	// 		`)
	// }
}