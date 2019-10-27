import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
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
        teamName
    } = params;

    const team = new this({ part, teamName });

    await team.save();

    return this.findOne({ _id: team._id }).populate({ path: 'part' });
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
        teamName
    } = params;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                part,
                teamName
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
        effEndDt
    } = params;

    const { _id } = await Manager.saveManager({ name, position, effStaDt, effEndDt });

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                managers: _id
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
 * @param       {Object} params
 */
TeamSchema.statics.editManager = async function (params) {
    let {
        id,
        managerId,
        name,
        position,
        effStaDt,
        effEndDt
    } = params;

    await Manager.editManager({ managerId, name, position, effStaDt, effEndDt });

    return this.findOne({ _id: id })
        .populate({ path: 'part' })
        .populate({ path: 'managers' });
};

export default model('Team', TeamSchema);