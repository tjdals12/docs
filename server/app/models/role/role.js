import { Schema, model, Types } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 권한
 */
const RoleSchema = new Schema({
    to: String,
    name: String,
    icon: String,
    layout: String,
    component: String,
    roleId: {
        READ: {
            type: Schema.Types.ObjectId
        },
        WRITE: {
            type: Schema.Types.ObjectId
        }
    },
    dispGb: {
        type: String,
        enum: ['01', '02']
    },
    sub: {
        type: Array,
        default: []
    },
    effStaDt: {
        type: Date,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    },
    effEndDt: {
        type: Date,
        default: DEFINE.COMMON.MAX_END_DT,
        get: DEFINE.dateConverter
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

RoleSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 10. 21
 * @description 권한 생성
 * @param       {Object} param
 */
RoleSchema.statics.createRole = function (param) {
    let {
        to,
        name,
        icon,
        layout,
        component,
        user
    } = param;

    const roleId = to === 'ROOT' ? { READ: new Types.ObjectId } : { READ: new Types.ObjectId, WRITE: new Types.ObjectId };

    const timestamp = new Timestamp({
        regId: user.profile.username,
        updId: user.profile.username,
    });
    const role = new this({ 
        to, 
        name, 
        icon, 
        layout, 
        component, 
        roleId,
        timestamp
    });

    return role.save();
};

/**
 * @author      minz-logger
 * @date        2019. 11. 25
 * @description 권한 추가
 * @param       {Object} param
 */
RoleSchema.statics.addRole = function (param) {
    let {
        id,
        to,
        name,
        icon,
        layout,
        component,
        user
    } = param;

    const roleId = to === 'ROOT' ? { READ: new Types.ObjectId } : { READ: new Types.ObjectId, WRITE: new Types.ObjectId };

    const timestamp = new Timestamp({
        regId: user.profile.username,
        updId: user.profile.username
    });
    const role = new this({ 
        to, 
        name, 
        icon, 
        layout, 
        component, 
        roleId,
        timestamp
    });

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: { sub: role },
            $set: {
                timestamp: {
                    updId: user.profile.username,
                    updDt: DEFINE.dateNow()
                }
            }
        },
        {
            new: true
        }
    );
};

export default model('Role', RoleSchema);