import user_service from '../services/user-service';
import { ResultFul } from '../middlewares/result-process';
import ConstantUtils from '../middlewares/ConstantUtils';

//权限
const role = (role) => {
    switch (role) {
        case 'sales':
            return [1, 10, 13];
        case 'team':
            return [1, 10, 12];
        case 'boss':
            return [1, 11];
        case 'admin':
            return {};
    };
};

//登录接口
exports.login = async function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    try {
        let result = await user_service.login(username, password);
        ResultFul.success(result, res);
    } catch (err) {
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }
}

//登出
exports.logout = async function(req, res) {
    try {
        let result = await user_service.logout(req, res);
        ResultFul.success(result, res);
    } catch (err) {
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }
}

//权限验证
exports.tokens = async(req, res) => {
    try {
        let result = await user_service.tokens(req, res);
        ResultFul.success(result, res);
    } catch (err) {
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }
};

//获取用户列表
exports.queryUsers = async(req, res) => {
    let { pageSize, page, username } = req.query;
    page = Number.parseInt(page) || 1;
    pageSize = Number.parseInt(pageSize) || 10;
    try {
        let result = await user_service.queryUsers(page, pageSize, username);
        ResultFul.success(result, res);
    } catch (err) {
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }
};

//添加用户
exports.createUser = async(req, res) => {
    try {
        let result = await user_service.createUser(req.body);
        ResultFul.success(result, res);
    } catch (err) {
        console.log('errrrrererer',err);
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }
};

//删除用户
exports.deleteUser = async(req, res) => {
    const id = req.query.id;
    try {
        let result = await user_service.deleteUser(id);
        ResultFul.success(result, res);
    } catch (err) {
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }
};

//修改用户信息
exports.modifyUser = async(req, res) => {
    let data = req.body;
    let visits = role(data.role);
    if (visits) data.visits = visits;
    try {
        let result = await user_service.modifyUser(data);
        ResultFul.success(result, res);
    } catch (err) {
        console.log('ererererer', err);
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }
};

//修改密码
exports.modifyPassword = async(req, res) => {
    let data = req.body;
    try {
        let result = await user_service.modifyPassword(data);
        ResultFul.success({data: result}, res);
    } catch (err) {
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }   
}

//获取某角色的相关用户
exports.getUsersByRole = async(req, res) => {
    let role = req.query.role;
    try {
        let result = await user_service.getUsersByRole(role);
        ResultFul.success({data: result}, res);
    } catch (err) {
        ResultFul.failedError(ConstantUtils.authority_failed, err, res);
    }
}