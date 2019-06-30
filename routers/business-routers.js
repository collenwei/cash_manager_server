import { Router } from 'express';
import business_controller from '../controllers/business-controller';

const router = module.exports = new Router();
router.prefix = '/v1/api';

//新建商品
router.route('/category/good').post(function(req, res) {
    business_controller.commodity(req, res);
});

//修改商品
router.route('/category/good/:id').put(function(req, res) {
	business_controller.updatecommodity(req, res);
});
//删除商品
router.route('/category/good/:id').delete(function(req, res) {
	business_controller.deletedcommodity(req, res);
});
//查询商品
router.route('/category/good').get(function(req, res) {
	business_controller.searchcommodity(req, res);
});

//新建客户
router.route('/newcustomer').get(function(req, res) {
    business_controller.newcustomer(req, res);
});


//修改客户
router.route('/updatecustomer').post(function(req, res) {
	business_controller.updatecustomer(req, res);
});

//调整客户折扣
router.route('/pricecustomer').post(function(req, res) {
	business_controller.pricecustomer(req, res);
});
//删除客户信息
router.route('/deletecustomer').post(function(req, res) {
	business_controller.deletecustomer(req, res);
});
//查询客户
router.route('/searchcustomer').get(function(req, res) {
	business_controller.searchcustomer(req, res);
});


//结算单查询
router.route('/settlement').post(function(req, res) {
	business_controller.settlement(req, res);
});

//录入客户每日商品数额
router.route('/order').post(function(req, res) {
	business_controller.setOrder(req, res);
});