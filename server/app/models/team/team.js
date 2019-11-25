import { Schema, model, Types } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import Manager from './manager';

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 팀 스키마
 */
const TeamSchema = new Schema({
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    teamName: String,
    managers: [{
        type: Schema.Types.ObjectId,
        ref: 'Manager',
        default: []
    }],
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 팀 생성
 * @param       {Object} params
 */
TeamSchema.statics.createTeam = async function (params) {
    let {
        part,
        teamName,
        user
    } = params;

    const timestamp = new Timestamp({
        regId: user.profile.username,
        updId: user.profile.username
    });
    const team = new this({ 
        part, 
        teamName,
        timestamp
    });

    await team.save();

    return this.findOne({ _id: team._id })
        .populate({ path: 'part' });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 27
 * @description 팀 수정
 */
TeamSchema.statics.editTeam = function (params) {
    let {
        id,
        part,
        teamName,
        user
    } = params;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                part,
                teamName,
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    )
        .populate({ path: 'part' })
        .populate({ path: 'manager' });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 28
 * @description 팀 삭제
 * @param       {String} id
 */
TeamSchema.statics.deleteTeam = async function (id) {
    const team = await this.findOne({ _id: id });

    if (team.managers.length > 0) {
        return;
    }

    return this.deleteOne({ _id: id });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 29
 * @description 담당자 조회
 * @param       {String} id
 */
TeamSchema.statics.findManager = async function (id) {
    let managerId = Types.ObjectId(id);

    return this.aggregate([
        {
            $match: {
                managers: { $in: [managerId] }
            }
        },
        {
            $project: {
                part: 1,
                teamName: 1,
                manager: { $arrayElemAt: ['$managers', { $indexOfArray: ['$managers', managerId] }] },
                timestamp: 1
            }
        },
        {
            $lookup: {
                from: 'cdminors',
                localField: 'part',
                foreignField: '_id',
                as: 'part'
            }
        },
        {
            $unwind: '$part'
        },
        {
            $lookup: {
                from: 'managers',
                localField: 'manager',
                foreignField: '_id',
                as: 'manager'
            }
        },
        {
            $unwind: '$manager'
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 담당자 추가
 * @param       {Object} param
 */
TeamSchema.statics.addManager = async function (params) {
    let {
        id,
        name,
        position,
        effStaDt,
        effEndDt,
        user
    } = params;

    const { _id } = await Manager.saveManager({ 
        name, 
        position, 
        effStaDt, 
        effEndDt, 
        user
    });

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                managers: _id
            },
            $set: {
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    )
        .populate({ path: 'part' })
        .populate({ path: 'managers' });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 27
 * @description 담당자 수정
 * @param       {Object} param
 */
TeamSchema.statics.editManager = async function (param) {
    let {
        id,
        managerId,
        name,
        position,
        effStaDt,
        effEndDt,
        user
    } = param;

    await Manager.editManager({ 
        managerId, 
        name, 
        position, 
        effStaDt, 
        effEndDt,
        user
    });

    return this.findOne({ _id: id })
        .populate({ path: 'part' })
        .populate({ path: 'managers' });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 28
 * @description 담당자 삭제
 * @param       {Object} param
 */
TeamSchema.statics.deleteManager = async function (param) {
    let { 
        id, 
        managerId,
        user
    } = param;

    await Manager.deleteManager({ id: managerId, user});

    return this.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                managers: managerId
            },
            $set: {
                updId: user.profile.username,
                updDt: DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    )
        .populate({ path: 'part' })
        .populate({ path: 'managers' });
};

export default model('Team', TeamSchema);