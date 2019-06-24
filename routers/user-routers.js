import { Router } from 'express';
import expressJwt from 'express-jwt';
import user_controller from '../controllers/user-controller';
import AuthConfig from '../config/auth-config';

let revokedTokens = [];

const jwtAuthorize = [
    expressJwt({
        secret: AuthConfig.secret,
        credentialsRequired: false,
        getToken: getTokenFromRequest,
        isRevoked(req, payload, done) {
            done(null, revokedTokens.includes(payload.iss))
        }
    }),
    (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: '登录超时' });
        // if (req.user.aud === 'beier') return next();
        // res.status(403).send({ error: 'Requires administrator.' });
        return next();
    }
];

const getTokenFromRequest = (req) => {
    if (!req.headers.authorization) return null;
    const temp = req.headers.authorization.split(' ');
    const types = ['Bearer', 'JWT'];
    if (types.includes(temp[0])) return temp[1];
    return req.params.token;
};


const router = module.exports = new Router();
router.prefix = '/api';

//登录接口
router.route('/login').post(function(req, res) {
    user_controller.login(req, res);
});

//登出接口
router.route('/logout').get(function(req, res) {
    user_controller.logout(req, res);
});


//权限验证
router.route('/tokens').get(...jwtAuthorize, (req, res) => {
    user_controller.tokens(req, res);
});


//获取用户列表
router.route('/users').get(function(req, res) {
    user_controller.queryUsers(req, res);
});

//修改用户信息
router.route('/users').patch(function(req, res) {
    user_controller.modifyUser(req, res);
});

//删除用户
router.route('/users').delete(function(req, res) {
    user_controller.deleteUser(req, res);
});

//新增用户
router.route('/users').post(function(req, res) {
    user_controller.createUser(req, res);
});

//修改密码
router.route('/users').put(function(req, res) {
    user_controller.modifyPassword(req, res);
})

router.route('/role/users').get(function(req, res) {
    user_controller.getUsersByRole(req, res);
})