import jwt from 'jsonwebtoken';
import AuthConfig from '../config/auth-config';
import Resultful from '../middlewares/result-process';
import ConstantUtils from '../middlewares/ConstantUtils';

export default function(req, res, next) {
	if(req.header('Authorization')) {
		let token = req.header('Authorization').slice(7);
		try {
			console.log('see the token', token)
			let tk = jwt.verify(token, AuthConfig.secret);
			req.userinfo = tk;
			// console.log('see the user info', tk)
			// next();
		} catch(err) {
			// console.log('see the token error', err)
			Resultful.failedError(ConstantUtils.permission_denied, '登陆超时，请重新登录', res);
		}
	}
	next()
}