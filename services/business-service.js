import { Good, GoodDAO } from '../models/good.model';
import { Customer, CustomerDAO } from '../models/customer.model';
import { Price, PriceDAO } from '../models/price.model';
import { Order, OrderDAO } from '../models/order.model';
import moment from 'moment';

exports.commodity = async function(body) {
	let good_list = await GoodDAO.search(body);
	if(good_list.length > 0) throw '该商品已登记';
	const result = await GoodDAO.insert(body);
	return {data:result};
}

exports.updatecommodity = async function(body, id) {
	const result = await GoodDAO.update(body, id);
	return {data:result};
}

exports.deletedcommodity = async function(id) {
	const result = await GoodDAO.delete(id);
	return {data:result};
}

exports.searchcommodity = async function(body) {
	const result = await GoodDAO.search(body);
	return {data:result};
}

exports.newcustomer = async function(body) {
	let customer_list = await CustomerDAO.search(body);
	if(customer_list.length > 0) throw '该用户已登记';
	const result = await CustomerDAO.insert(body);
	return {data: result};
}

exports.updatecustomer = async function(body, id) {
	const result = await CustomerDAO.update(body, id);
	return {data:result};
}

exports.pricecustomer = async function({price, good_id, customer_id}) {
	if(await PriceDAO.exist(good_id, customer_id)) {
		const result = await PriceDAO.price(customer_id, good_id, price);
		return {data: result};
	} else {
		const result = await PriceDAO.insert({price, good_id, customer_id});
		return {data: result};
	}
}

exports.deletecustomer = async function(customer_id) {
	await CustomerDAO.delete(customer_id);
	await PriceDAO.deletecustomer(customer_id);
	return {};
}

exports.searchcustomer = async function({customer_name, page, pageSize}) {
	let customer_list = await CustomerDAO.search(customer_name, page, pageSize);
	return {data: customer_list};
}

exports.settlement = async function(body) {
	let settle_list = await OrderDAO.settleSearch(body);

}