import pgp from 'pg-promise';
const connection = {
	user: process.env.PGUS || 'tongyu',//tongyu
	password: process.env.PGPW || "nsRNxff0jI",//nsRNxff0jI
	host: process.env.POSTGRES || '10.1.2.63',//10.1.2.63
	database: process.env.PGDATABASE || 'ficc',
	port: process.env.PGPORT || '5432'
}

const db = pgp()(connection);
module.exports = db;