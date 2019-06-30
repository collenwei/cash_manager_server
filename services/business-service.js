import { Goods, GoodsDAO } from '../models/goods.model';
import { Customer, CustomerDAO } from '../models/customer.model';
import { Price, PriceDAO } from '../models/price.model';
import { Order, OrderDAO } from '../models/order.model';
import moment from 'moment';

exports.commodity = async function(body) {
	let goods_list = await GoodsDAO.search(body);
	if(goods_list.length > 0) throw '该商品已登记';
	const result = await GoodsDAO.insert(body);
	return {data:result};
}

exports.updatecommodity = async function(body, id) {
	const result = await GoodsDAO.update(body, id);
	return {data:result};
}

exports.deletedcommodity = async function(id) {
	const result = await GoodsDAO.delete(id);
	return {data:result};
}

exports.searchcommodity = async function(body) {
	const result = await GoodsDAO.search(body);
	return {data:result};
}

exports.newcustomer = async function(body) {
	let customer_list = await CustomerDAO.search(body);
	if(customer_list.length > 0) throw '该客户已登记';
	const result = await CustomerDAO.insert(body);
	return {data: result};
}

exports.updatecustomer = async function(body, id) {
	const result = await CustomerDAO.update(body, id);
	return {data:result};
}

exports.pricecustomer = async function({price, goods_id, customer_id}) {
	if(await PriceDAO.exist(goods_id, customer_id)) {
		const result = await PriceDAO.price(customer_id, goods_id, price);
		return {data: result};
	} else {
		const result = await PriceDAO.insert({price, goods_id, customer_id});
		return {data: result};
	}
}

exports.deletecustomer = async function(customer_id) {
	await CustomerDAO.delete(customer_id);
	await PriceDAO.deletecustomer(customer_id);
	return {};
}
//需要追加价格客户价格信息列表
exports.searchcustomer = async function({customer_name, page, pageSize}) {
	let customer_list = await CustomerDAO.search({customer_name, page, pageSize});
	return {data: customer_list};
}

exports.searchcustomerprice = async function({customer_name, page, pageSize}) {
	let customer_list = await CustomerDAO.search({customer_name, page, pageSize});
	let goods_list = await GoodsDAO.getList();
	let goods_name = {};
	let result_list = [];
	for(let customer of customer_list) {
		let cell = {};
		for(let i = 0; i < goods_list.length; i++) {
			let prices = await PriceDAO.getPrice(customer.id, goods_list[i].id);
			if(prices.length > 0) {
				console.log('price', prices)
				cell[`goods_${goods_list[i].id}_price`] = prices[0].price;
			} else {
				console.log('goods_price', goods_list[i])
				cell[`goods_${goods_list[i].id}_price`] = goods_list[i].goods_price;
			}
			goods_name[`goods_${goods_list[i].id}_price`] = goods_list[i].goods_name;
		}
		cell[`customer_name`] = customer.customer_name;
		cell[`customer_address`] = customer.customer_address;
		cell[`customer_contact`] = customer.customer_contact;
		cell[`customer_remark`] = customer.customer_remark;
		result_list.push(cell);
	}
	return {data: {data_list: result_list, key_list: goods_name}};
}

exports.settlement = async function(body) {
	let settle_list = await OrderDAO.settleSearch(body);

}