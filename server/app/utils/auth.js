require('dotenv').config();

import Crypto from 'crypto';
import JWT from 'jsonwebtoken';

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 비밀번호 암호화
 */
export const hash = (password) => {
    return Crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
};

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 토큰 발급
 */
export const generateToken = (payload) => {
    return new Promise((resolve, reject) => {
        JWT.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
            if (err) reject(err);

            resolve(token);
        });
    });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 토근 해독
 */
export const decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) reject(err);

            resolve(decoded);
        });
    });
};