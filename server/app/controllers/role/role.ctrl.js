import Role from 'models/role/role';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 10. 21
 * @description 권한 목록 조회
 */
export const list = async (ctx) => {
    try {
        const roles = await Role.find();

        ctx.res.ok({
            data: roles,
            message: 'Success - roleCtrl > list'
        });
    } catch (e) {
        ctx.res.internaleServerError({
            data: [],
            message: `Error - roleCtrl > list: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 21
 * @description 권한 생성
 */
export const create = async (ctx) => {
    const { user } = ctx.request;

    if(!user) {
        ctx.res.forbidden({
            message: 'Authentication failed'
        });

        return;
    }

    let {
        to,
        name,
        icon,
        layout,
        component,
        roleType
    } = ctx.request.body;

    const schema = Joi.object().keys({
        to: Joi.string().required(),
        name: Joi.string().required(),
        icon: Joi.string().required(),
        layout: Joi.string().required(),
        component: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - roleCtrl > create'
        });

        return;
    }

    try {
        const role = await Role.createRole({ 
            to, 
            name, 
            icon, 
            layout, 
            component, 
            roleType,
            user
        });

        ctx.res.ok({
            data: role,
            message: 'Success- roleCtrl > create'
        });
    } catch (e) {
        ctx.res.internaleServerError({
            data: ctx.request.body,
            message: `Error - roleCtrl > create: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 21
 * @description 권한 추가
 */
export const add = async (ctx) => {
    const { user } = ctx.request;

    if(!user) {
        ctx.res.forbidden({
            message: 'Authentication failed'
        });

        return;
    }

    let { id } = ctx.params;
    let {
        to,
        name,
        icon,
        layout,
        component,
        roleType
    } = ctx.request.body;

    const schema = Joi.object().keys({
        to: Joi.string().required(),
        name: Joi.string().required(),
        icon: Joi.string().required(),
        layout: Joi.string().required(),
        component: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - roleCtrl > create'
        });

        return;
    }

    try {
        const role = await Role.addRole({ 
            id, 
            to, 
            name, 
            icon, 
            layout, 
            component, 
            roleType,
            user
        });

        ctx.res.ok({
            data: role,
            message: 'Success - roleCtrl > add'
        });
    } catch (e) {
        ctx.res.internaleServerError({
            data: ctx.request.body,
            message: `Error - roleCtrl > add: ${e.message}`
        });
    }
};