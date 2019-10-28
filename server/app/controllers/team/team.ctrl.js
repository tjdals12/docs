import Team from 'models/team/team';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 팀 생성
 */
export const create = async (ctx) => {
    let {
        part,
        teamName
    } = ctx.request.body;

    const schema = Joi.object().keys({
        part: Joi.string().required(),
        teamName: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fai - teamCtrl > create'
        });

        return;
    }

    try {
        const team = await Team.createTeam({ part, teamName });

        ctx.res.ok({
            data: team,
            message: 'Success - teamCtrl > crate'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - teamCtrl > create: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 팀 목록 조회
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
        const teams = await Team.find()
            .sort({ 'timestamp.regDt': -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .populate({ path: 'part' })
            .populate({ path: 'managers' });

        const count = await Team.countDocuments();

        ctx.set('Total', count);
        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: teams,
            message: 'Success - teamCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            message: `Error - teamCtrl > list: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 팀 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const team = await Team.findOne({ _id: id })
            .populate({ path: 'part' })
            .populate({ path: 'managers' });

        ctx.res.ok({
            data: team,
            message: 'Success - teamCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id: id },
            message: `Error - teamCtrl > one: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 27
 * @description 팀 수정
 */
export const edit = async (ctx) => {
    let { id } = ctx.params;
    let { part, teamName } = ctx.request.body;

    const schema = Joi.object().keys({
        part: Joi.string().required(),
        teamName: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - teamCtrl > edit'
        });

        return;
    }

    try {
        const team = await Team.editTeam({ id, part, teamName });

        ctx.res.ok({
            data: team,
            message: 'Success - teamCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id: id, ...ctx.request.body },
            message: `Error - teamCtrl > edit: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 28
 * @description 팀 삭제
 */
export const deleteTeam = async (ctx) => {
    let { id } = ctx.params;

    try {
        const result = await Team.deleteTeam(id);

        if (result) {
            ctx.res.ok({
                data: result,
                message: 'Success - teamCtrl > deleteTeam'
            });
        } else {
            ctx.res.badRequest({
                message: 'Fail - teamCtrl > deleteTeam'
            });
        }
    } catch (e) {
        ctx.res.internalServerError({
            data: { id: id },
            message: `Error - teamCtrl > deleteTeam: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 담당자 추가
 */
export const add = async (ctx) => {
    let { id } = ctx.params;
    let {
        name,
        position,
        effStaDt,
        effEndDt
    } = ctx.request.body;

    const schema = Joi.object().keys({
        name: Joi.string().required(),
        position: Joi.string().required(),
        effStaDt: Joi.string().required(),
        effEndDt: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - teamCtrl > add'
        });

        return;
    }

    try {
        const team = await Team.addManager({ id, name, position, effStaDt, effEndDt });

        ctx.res.ok({
            data: team,
            message: 'Success - teamCtrl > add'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - teamCtrl > add: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 27
 * @description 담당자 수정
 */
export const editManager = async (ctx) => {
    let { id } = ctx.params;
    let { managerId, name, position, effStaDt, effEndDt } = ctx.request.body;

    const schema = Joi.object().keys({
        managerId: Joi.string().required(),
        name: Joi.string().required(),
        position: Joi.string().required(),
        effStaDt: Joi.string().required(),
        effEndDt: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - teamCtrl > editManager'
        });

        return;
    }

    try {
        const team = await Team.editManager({ id, managerId, name, position, effStaDt, effEndDt });

        ctx.res.ok({
            data: team,
            message: 'Success - teamCtrl > editManager'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id: id, ...ctx.request.body },
            message: `Error - teamCtrl > editManager: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 10. 28
 * @description 담당자 삭제
 */
export const deleteManager = async (ctx) => {
    let { id } = ctx.params;
    let { managerId } = ctx.request.body;

    const schema = Joi.object().keys({
        managerId: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.data.badRequest({
            data: result.error,
            message: 'Fail - teamCtrl > deleteManager'
        });

        return;
    }

    try {
        const team = await Team.deleteManager({ id, managerId });

        ctx.res.ok({
            data: team,
            message: 'Success - teamCtrl > deleteManager'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - teamCtrl > deleteManager: ${e.message}`
        });
    }
};