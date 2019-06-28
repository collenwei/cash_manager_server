import pgdb from '../config/postgres.db.js';

export class Good {
	constructor(data) {
		if(data.id) this.id = data.id;
		this.good_name = data.good_name;
		this.good_price = data.good_price;
		this.good_remark = data.good_remark;
		this.isdeleted = false;
	};
	static database() {
		return 'clean.good';
	}
	
}

export class GoodDAO {
	static async insert(data) {
		const good = new Good(data);
		const key = Object.keys(good);
		const result = await pgdb.any( 
			`INSERT INTO ${Good.database()} (${key.join(',')}) VALUES (${[...Array(key.length).keys()].map((_,i)=>"$"+(i+1))})`,
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
        console.log('sql ', `UPDATE ${Good.database()} SET ${item.toString()} WHERE id=${data.id}`)
        let result = await pgdb.query(`UPDATE ${Good.database()} SET ${item.toString()} WHERE id=${data.id}`,
            fields.map(key => data[key])
        );
        return result;
	}

	static async delete(id) {
		let result = await pgdb.any(`UPDATE ${Good.database()} SET isdeleted=true WHERE id=${id}`)
		return result;
	}

	//不够抽象化
	static async search(body) {
		let result = await pgdb.any(`SELECT * FROM ${Good.database()} WHERE isdeleted=false AND 
			${body.good_name? ('good_name='+body.good_name):'1=1'} ORDER BY id DESC LIMIT ${body.pageSize} OFFSET ${body.pageSize*(body.page-1)}`);
		return result;
	}
}