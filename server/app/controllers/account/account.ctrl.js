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
        ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 60 * 60 * 60 * 24 * 1000 });

        ctx.res.ok({
            data: {
                _id: currentUser._id,
                profile: currentUser.profile
            },
            message: 'Success - accountCtrl > login'
        });
    } catch (e) {
        ctx.res.internalServerError({
            message: `Error - accountCtrl > login: ${e.message}`
        });
    }
};