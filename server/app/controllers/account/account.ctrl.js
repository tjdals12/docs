import User from 'models/user/user';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 10. 19
 * @description 계정 생성
 */
export const create = async (ctx) => {
    let {
        username,
        description,
        userType,
        userId,
        pwd
    } = ctx.request.body;

    const schema = Joi.object().keys({
        username: Joi.string().required(),
        description: Joi.string().required(),
        userType: Joi.string().required(),
        userId: Joi.string().min(4).required(),
        pwd: Joi.string().min(4).max(16).required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - accountCtrl > create'
        });

        return;
    }

    try {
        const user = await User.createUser({ username, description, userType, userId, pwd });

        ctx.res.ok({
            data: user,
            message: 'Success - accountCtrl > create'
        });
    } catch (e) {
        ctx.res.internalServerError({
            message: `Error - accountCtrl > create: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 11. 02
 * @description 계정 목록 조회
 */
export const list = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    try {
        const accounts = await User.find({}, { pwd: 0 })
            .sort({ 'timestamp.regDt': -1 })
            .skip((page - 1) * 10)
            .limit(10);

        const count = await User.countDocuments();

        ctx.set('Total', count);
        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: accounts,
            message: 'Success - accountCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            message: `Error - accountCtrl > list: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 11. 02
 * @description 계정 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        let account = await User.findOne({ _id: id }, { pwd: 0 });

        ctx.res.ok({
            data: account,
            message: 'Success - accountCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id: id },
            message: `Error - accountCtrl > one: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 로그인
 */
export const login = async (ctx) => {
    let { userId, pwd } = ctx.request.body;

    const schema = Joi.object().keys({
        userId: Joi.string().required(),
        pwd: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - accountCtrl > login'
        });

        return;
    }

    try {
        const currentUser = await User.findByUserId(userId);

        if (!currentUser || !currentUser.validatePassword(pwd)) {
            ctx.res.badRequest({
                message: 'Fail - accountCtrl > login'
            });

            return;
        }

        const token = await currentUser.generateToken();
        ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 60 * 60 * 3 * 1000 });

        ctx.res.ok({
            data: {
                _id: currentUser._id,
                profile: currentUser.profile,
                roles: currentUser.roles
            },
            message: 'Success - accountCtrl > login'
        });
    } catch (e) {
        ctx.res.internalServerError({
            message: `Error - accountCtrl > login: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 21
 * @description 로그인 여부 확인
 */
export const check = async (ctx) => {
    let { user } = ctx.request;

    if (!user) {
        ctx.res.forbidden({
            data: user,
            message: 'Fail - accountCtrl > check'
        });

        return;
    }

    try {
        ctx.res.ok({
            data: {
                _id: user._id,
                profile: user.profile,
                roles: user.roles
            },
            message: 'Success - accountCtrl > check'
        });
    } catch (e) {
        ctx.res.internalServerError({
            message: `Error - accountCtrl > check: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 21
 * @description 로그아웃
 */
export const logout = (ctx) => {
    try {
        ctx.cookies.set('access_token', null, { httpOnly: true, maxAge: 0 });

        ctx.res.ok({
            message: 'Success - accountCtrl > logout'
        });
    } catch (e) {
        ctx.res.internalServerError({
            message: `Error - accountCtrl > logout: ${e.message}`
        });
    }
};