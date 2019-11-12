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
 * @param       {Object} params
 */
RoleSchema.statics.createRole = function (params) {
    let {
        to,
        name,
        icon,
        layout,
        component
    } = params;

    const roleId = to === 'ROOT' ? { READ: new Types.ObjectId } : { READ: new Types.ObjectId, WRITE: new Types.ObjectId };

    const role = new this({ to, name, icon, layout, component, roleId });

    return role.save();
};

RoleSchema.statics.addRole = function (params) {
    let {
        id,
        to,
        name,
        icon,
        layout,
        component
    } = params;

    const roleId = to === 'ROOT' ? { READ: new Types.ObjectId } : { READ: new Types.ObjectId, WRITE: new Types.ObjectId };

    const role = new this({ to, name, icon, layout, component, roleId });

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: { sub: role }
        },
        {
            new: true
        }
    );
};

export default model('Role', RoleSchema);