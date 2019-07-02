import business_service from '../services/business-service';
import { ResultFul } from '../middlewares/result-process';
import ConstantUtils from '../middlewares/ConstantUtils';
import moment from 'moment';

exports.commodity = async function(req, res) {
	let body = {}
	body.goods_name = req.body.goods_name;
	body.goods_price = req.body.goods_price;
	body.goods_remark = req.body.goods_remark;
	try {
		let result = await business_service.commodity(body);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.updatecommodity = async function(req, res) {
	let body = {};
	body.goods_name = req.body.goods_name;
	body.goods_price = req.body.goods_price;
	body.goods_remark = req.body.goods_remark;
	let id = req.params.id;
	try {
		let result = await business_service.updatecommodity(body, id);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.deletedcommodity = async function(req, res) {
	try {
		let result = await business_service.deletedcommodity(req.params.id);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.searchcommodity = async function(req, res) {
	let { pageSize, page, goods_name } = req.query;
    // page = Number.parseInt(page) || 1;
    // pageSize = Number.parseInt(pageSize) || 10;
	try {
		let result = await business_service.searchcommodity({ pageSize, page, goods_name });
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.newcustomer = async function(req, res) {
	let body = {}
	body.customer_name = req.body.customer_name;
	body.customer_address = req.body.customer_address;
	body.customer_contact = req.body.customer_contact;
	body.customer_remark = req.body.customer_remark;
	body.goods_ids = req.body.goods_ids;
	try {
		let result = await business_service.newcustomer(body);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.updatecustomer = async function(req, res) {
	let body = {};
	body.customer_name = req.body.customer_name;
	body.customer_address = req.body.customer_address;
	body.customer_contact = req.body.customer_contact;
	body.customer_remark = req.body.customer_remark;
	body.goods_ids = req.body.goods_ids;
	let id = req.params.id;
	try {
		let result = await business_service.updatecustomer(body, id);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.pricecustomer = async function(req, res) {
	let body = {};
	body.customer_id = req.body.customer_id;
	body.goods_prices = req.body.goods_prices;
	try {
		let result = await business_service.pricecustomer(body);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.customergoods = async function(req, res) {
	let customer_id = req.body.customer_id;
	let goods_ids = req.body.goods_ids;
	try {
		let result = await business_service.customergoods(customer_id, goods_ids);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.deletecustomer = async function(req, res) {
	let customer_id = req.params.id;
	try {
		let result = await business_service.deletecustomer(customer_id);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.searchcustomer = async function(req, res) {
	let { pageSize, page, customer_name} = req.query;
    page = Number.parseInt(page) || 1;
    pageSize = Number.parseInt(pageSize) || 10;
	try {
		let result = await business_service.searchcustomer({ pageSize, page, customer_name});
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.searchcustomerprice = async function(req, res) {
	let { pageSize, page, customer_name} = req.query;
    page = Number.parseInt(page) || 1;
    pageSize = Number.parseInt(pageSize) || 10;
    try {
		let result = await business_service.searchcustomerprice({ pageSize, page, customer_name});
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.settlement = async function(req, res) {
	let {customer_id, page, pageSize, start_date, end_date} = req.query;
	page = Number.parseInt(page) || 1;
	pageSize = Number.parseInt(pageSize) || 10;
	start_date = start_date || moment(new Date('1900-01-01')).format('YYYY-MM-DD');
	end_date = end_date || moment(new Date('2100-01-01')).format('YYYY-MM-DD');
	try {
		let result = await business_service.settlement({customer_id, pageSize, page, start_date, end_date});
		ResultFul.success(result, res);
	} catch(err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.settlementmonth = async function(req, res) {
	let {customer_id, page, pageSize, month, year} = req.query;
	page = Number.parseInt(page) || 1;
	pageSize = Number.parseInt(pageSize) || 10;
	try {
		let result = await business_service.settlementmonth({customer_id, pageSize, page, month, year});
		ResultFul.success(result, res);
	} catch(err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.settlementtotal = async function(req, res) {
	let {customer_id, page, pageSize} = req.query;
	page = Number.parseInt(page) || 1;
	pageSize = Number.parseInt(pageSize) || 10;
	try {
		let result = await business_service.settlementtotal({customer_id, pageSize, page});
		ResultFul.success(result, res);
	} catch(err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.setOrder = async function(req, res) {
	let {customer_id, goods, date, remark} = req.body;
	try {
		let result = await business_service.setOrder(customer_id, goods, date, remark);
		ResultFul.success(result, res);
	} catch(err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}