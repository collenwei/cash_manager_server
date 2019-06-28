import business_service from '../services/business-service';
import { ResultFul } from '../middlewares/result-process';
import ConstantUtils from '../middlewares/ConstantUtils';

exports.commodity = async function(req, res) {
	let body = {}
	body.good_name = req.body.good_name;
	body.good_price = req.body.good_price;
	try {
		let result = await business_service.commodity(body);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.updatecommodity = async function(req, res) {
	let body = {};
	body.good_name = req.body.good_name;
	body.good_price = req.body.good_price;
	body.good_remark = req.body.good_remark;
	let id = req.body.id;
	try {
		let result = await business_service.updatecommodity(body, id);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.deletedcommodity = async function(req, res) {
	try {
		let result = await business_service.deletedcommodity(req.body.id);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.searchcommodity = async function(req, res) {
	let { pageSize, page, good_name } = req.query;
    page = Number.parseInt(page) || 1;
    pageSize = Number.parseInt(pageSize) || 10;
	try {
		let result = await business_service.searchcommodity({ pageSize, page, good_name });
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
	let id = req.body.id;
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
	body.good_id = req.body.good_id;
	body.price = req.body.price;
	try {
		let result = await business_service.pricecustomer(body);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.deletecustomer = async function(req, res) {
	let customer_id = req.body.id;
	try {
		let result = await business_service.deletecustomer(req.body.id);
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}

exports.searchcustomer = async function(req, res) {
	let { pageSize, page, good_name } = req.query;
    page = Number.parseInt(page) || 1;
    pageSize = Number.parseInt(pageSize) || 10;
	try {
		let result = await business_service.searchcustomer({ pageSize, page, good_name });
		ResultFul.success(result, res);
	} catch (err) {
		ResultFul.failedError(ConstantUtils.authority_failed, err, res);
	}
}