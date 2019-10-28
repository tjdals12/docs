import * as auth from 'utils/auth';

/**
 * @author      minz-logger
 * @date        2019. 10. 21
 * @description 토큰 미들웨어 (인증 여부 확인, 인증 정보 획득)
 */
const jwtMiddleware = () => {
    return async (ctx, next) => {
        const token = ctx.cookies.get('access_token');

        if (!token) return next();

        try {
            const decoded = await auth.decodeToken(token);

            if (Date.now() / 1000 - decoded.iat > 60 * 60 * 2) {
                const { _id, profile } = decoded;
                const refreshToken = auth.generateToken({ _id, profile });
                ctx.cookies.set('access_token', refreshToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 });
            }

            ctx.request.user = decoded;
        } catch (e) {
            ctx.res.internalServerError({
                message: `Error - jwtMiddleware: ${e.message}`
            });
        }

        return next();
    };
};

export default jwtMiddleware;
