import pgp from 'pg-promise';
const connection = {
	user: process.env.PGUS || 'collen',//tongyu
	password: process.env.PGPW || "123qweasd",//nsRNxff0jI
	host: process.env.POSTGRES || '47.103.89.78',//10.1.2.63
	database: process.env.PGDATABASE || 'demo',
	port: process.env.PGPORT || '5432'
}

const db = pgp()(connection);
module.exports = db;