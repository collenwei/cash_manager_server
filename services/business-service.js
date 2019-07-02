import { Goods, GoodsDAO } from '../models/goods.model';
import { Customer, CustomerDAO } from '../models/customer.model';
import { Price, PriceDAO } from '../models/price.model';
import { Order, OrderDAO } from '../models/order.model';
import { Orders, OrdersDAO } from '../models/orders.model';
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
	body.customer_uid = Date.now();
	const result = await CustomerDAO.insert(body);
	const datas = await CustomerDAO.getCustomerByUid(body.customer_uid);

	return await this.customergoods(datas[0].id, body.goods_ids);;
}

exports.updatecustomer = async function(body, id) {
	const result = await CustomerDAO.update(body, id);
	await this.customergoods(id, body.goods_ids)
	return {data:result};
}

exports.pricecustomer = async function({customer_id, goods_prices}) {
	for(let goods_price of goods_prices) {
		 await PriceDAO.price(customer_id, goods_price.goods_id, goods_price.price);
	}
	return {};
}

exports.customergoods = async function(customer_id, goods_ids) {
	let exist_price = [];
	let not_exist_price = [];
	let price_list = await PriceDAO.getPriceList(customer_id);
	for(let goods_id of goods_ids) {
		for(let price of price_list) {
			if(goods_id == price.goods_id) {
				exist_price.push(goods_id);
			} 
		}
	}
	goods_ids.map(value => {
		if(exist_price.indexOf(value) == -1)
			not_exist_price.push(value);
	}) 
	console.log('exist_price', exist_price)
	console.log('not_exist_price', not_exist_price)
	if(not_exist_price.length > 0) {
		for(let goods_id of not_exist_price) {
			let goods = await GoodsDAO.getGoods(goods_id);
			await PriceDAO.insert({
				customer_id: customer_id,
				goods_id: goods_id,
				price: goods[0].goods_price,
			})
		}
	}
	await PriceDAO.markprices(customer_id, goods_ids);
	return {};
}

exports.deletecustomer = async function(customer_id) {
	await CustomerDAO.delete(customer_id);
	await PriceDAO.deletecustomer(customer_id);
	return {};
}

exports.searchcustomer = async function({customer_name, page, pageSize}) {
	console.log("CustomerDAO")
	let customer_list = await CustomerDAO.search({customer_name, page, pageSize});
	let result = [];
	console.log("PriceDAO")
	for(let customer of customer_list) {
		let price_list = await PriceDAO.getPriceList(customer.id)
		if(price_list.length > 0)
			customer.price_goods = price_list;
		else 
			customer.price_goods = [{goods_name: '暂无挂钩商品', goods_id: -1}]
		result.push(customer);
	}
	return {data: result};
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
				cell[`goods_${goods_list[i].id}`] = {price: prices[0].price, goods_name: goods_list[i].goods_name, goods_id: goods_list[i].id};
			} 
			// else {
			// 	cell[`goods_${goods_list[i].id}`] = {price: goods_list[i].goods_price, goods_name: goods_list[i].goods_name, goods_id: goods_list[i].id};
			// }
		}
		cell[`customer_name`] = customer.customer_name;
		cell[`customer_address`] = customer.customer_address;
		cell[`customer_contact`] = customer.customer_contact;
		cell[`customer_remark`] = customer.customer_remark;
		result_list.push(cell);
	}
	return {data: result_list};
}

//日结算；需要确认结算方式，若每月结算，月中如果价格变动。结算应如何进行？
exports.settlement = async function({customer_id, pageSize, page, start_date, end_date}) {
	let orders_list = await OrdersDAO.query(customer_id, page, pageSize, start_date, end_date);
	let goods_list = await GoodsDAO.getList();
	let result = []
	for(let orders of orders_list) {
		let cell = {}
		cell.order = [];
		for(let goods of goods_list) {
			let order = await OrderDAO.getOrder(orders.customer_id, goods.id, moment(orders.date).format('YYYY-MM-DD'));
			cell.order.push({
				number: order.length > 0 ? order[0].number: 0,
				goods_name: goods.goods_name
			})
		}
		let customer = await CustomerDAO.getCustomer(orders.customer_id);
		cell.id = orders.id;
		cell.customer_name = customer[0].customer_name;
		cell.date = moment(orders.date).format("YYYY-MM-DD");
		cell.remark = orders.remark;
		cell.total = orders.total;
		result.push(cell);
	}
	return {data: result};
}

//月结算
exports.settlementmonth = async function({customer_id, month, year}) {
	let customer_list = await CustomerDAO.getCustomer(customer_id);
	let goods_list = await GoodsDAO.getList();
	let nextmonth = (month==12? 1:(parseInt(month)+1));
	let nextyear = (month==12? (parseInt(year)+1):year);
	let result = [];
	console.log('month',`${year}${month>9? month: `0${month}`}01` )
	console.log('nextmonth', `${nextyear}${nextmonth>9? nextmonth: `0${nextmonth}`}01`)
	for(let customer of customer_list) {
		let cell = {};
		let customer_orders = await OrderDAO.getOrders(customer.id, `${year}${month>9? month: `0${month}`}01`, `${nextyear}${nextmonth>9? nextmonth: `0${nextmonth}`}01`);
		let customer_totals = await OrdersDAO.getOrdersSum(customer.id, `${year}${month>9? month: `0${month}`}01`, `${nextyear}${nextmonth>9? nextmonth: `0${nextmonth}`}01`);
		cell.customer_id = customer.id;
		cell.customer_name = customer.customer_name;
		cell.date = `${year}${month>9? month: `0${month}`}`;
		cell.goods = [];
		if(customer_totals.length > 0) {
			cell.total = customer_totals[0].sum;
			for(let order of customer_orders) {
				for(let goods of goods_list) {
					if(goods.id == order.goods_id) {
						let item = {
							goods_name: goods.goods_name,
							sum: order.sum
						}
						cell.goods.push(item);
					}
				}
			}
		} else {
			cell.total = 0;
		}
		result.push(cell);
	}
	return {data: result};
}

//总计
exports.settlementtotal = async function({customer_id}) {
	let customer_list = await CustomerDAO.getCustomer(customer_id);
	let goods_list = await GoodsDAO.getList();
	let result = [];
	for(let customer of customer_list) {
		let cell = {};
		let customer_orders = await OrderDAO.getOrders(customer.id, `19000101`, `21000101`);
		let customer_totals = await OrdersDAO.getOrdersSum(customer.id, `19000101`, `21000101`);
		cell.customer_id = customer.id;
		cell.customer_name = customer.customer_name;
		cell.goods = [];
		if(customer_totals.length > 0) {
			cell.total = customer_totals[0].sum;
			for(let order of customer_orders) {
				for(let goods of goods_list) {
					if(goods.id == order.goods_id) {
						let item = {
							goods_name: goods.goods_name,
							sum: order.sum
						}
						cell.goods.push(item);
					}
				}
			}
		} else {
			cell.total = 0;
		}
		result.push(cell);
	}
	return {data: result};
}

//当日订单已出则更改客户折扣后，订单价格不会自动变更，需要手动调整价格
const createOrder = async function(customer_id, item, date) {
	let order_list = await OrderDAO.getOrder(customer_id, item.goods_id, date);
	console.log('order_list1', order_list);
	if(order_list.length > 0) {
		let order = {
			price: item.price,
			number: item.order,
			order_date: date
		}
		console.log('order', order)
		await OrderDAO.update(order, order_list[0].id);
		return {}
	} else {
		let order = {
			customer_id: customer_id,
			goods_id: item.goods_id,
			price: item.price,
			number: item.order,
			order_date: date, 
		}
		console.log('order', order)
		let result = await OrderDAO.insert(order);
		return {}
	}
}

exports.setOrder = async function(customer_id, items, order_date, remark) {
	let total_amount = 0;
	for(let item of items) {
		let goods = await PriceDAO.getPrice(customer_id, item.goods_id);
		item.price = goods[0].price;
		total_amount = total_amount + item.price*item.order;
		await createOrder(customer_id, item, order_date);
	}
	let order_ids = await OrderDAO.getOrderIds(customer_id, order_date);
	order_ids = order_ids.map((data) => {
		let id = data.id;
		return id;
	});
	let orders_list = await OrdersDAO.getOrders(customer_id, order_date);
	if(orders_list.length > 0) {
		let orders = {
			customer_id: customer_id,
			orders: {ids: order_ids},
			date: order_date,
			total: total_amount,
			remark: remark
		}
		await OrdersDAO.update(orders, orders_list[0].id);
	} else {
		let orders = {
			customer_id: customer_id,
			orders: {ids: order_ids},
			date: order_date,
			total: total_amount,
			remark: remark
		}
		await OrdersDAO.insert(orders);
	}
	return {};
}