import { Good, GoodDAO } from '../models/good.model';
import moment from 'moment';

exports.commodity = async function(body) {
	let good_list = await GoodDAO.getGoodsList(body);
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