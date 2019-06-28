import crypto from 'utility';
import jwt from 'jsonwebtoken';
import { User, UserDAO } from '../models/user.model';
import AuthConfig from '../config/auth-config';
import moment from 'moment';
import expressJwt from 'express-jwt';


exports.login = async function(username, password) {
    var pwd = password;//crypto.md5(password + 'collen');
    var userdata = {username: 'accord', password:'1234'}//await UserDAO.getByName(username);
    if (userdata && userdata.password == pwd) {
        userdata.sub = userdata.username;
        let token = jwt.sign(userdata, AuthConfig.secret, {algorithm: 'HS256' , expiresIn: 60 * 60 * 1000 });
        return { role: userdata.role, user: userdata.username, department_id: userdata.department_id, token: token };
    } else {
        throw '用户名或密码错误';
    }
}


exports.tokens = (req, res) => {
    return { user: { username: req.user.name, permissions: { role: req.user.role, visit: req.user.visit } } };
};

//获取用户列表
exports.queryUsers = async(page, pageSize, username) => {
    const count = await UserDAO.getUsersCount();
    const userdata = await UserDAO.queryUsers(page, pageSize, username);
    const role = await UserDAO.queryRole();
    const department = await UserDAO.queryDepartment();
    return { data: userdata, count: parseInt(count[0].count), roles: role, departments: department };
};

//添加用户
exports.createUser = async(data) => {
    let user_list = await UserDAO.getByName(data.username);
    if(user_list)
        throw '用户名重复'
    else {
        data.password = crypto.md5(data.password + 'tongyu');
        const result = await UserDAO.insert(data);
        return { data: result };
    }
};

//删除用户
exports.deleteUser = async(data) => {
    const result = await UserDAO.delete(data);
    return { data: result };
}

//修改用户信息
exports.modifyUser = async(data) => {
    if(data.password)
        data.password = crypto.md5(data.password + 'tongyu');
    const result = await UserDAO.update(data);
    return { data: result };
};

//md5 
exports.modifyPassword = async(data) => {
    let user = await UserDAO.getByName(data.username)
    let newpassword = crypto.md5(data.newpassword + 'tongyu');
    let oldpassword = crypto.md5(data.oldpassword + 'tongyu');
    if (oldpassword == user.password) {
        const result = await UserDAO.update({ password: newpassword, id: user.id })
        return result
    } else {
        throw '密码确认有误';
    }
}
exports.logout = async(req, res) => {
    return {};
}

exports.getUsersByRole = async(role) => {
    let rid = await UserDAO.queryRoleId(role)
    let result = await UserDAO.queryUserByRoleId(rid);
    return result;
}