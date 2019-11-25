import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 담당자 스키마
 */
const ManagerSchema = new Schema({
    name: String,
    position: String,
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
    deleteYn: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_NO
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

ManagerSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 10. 26
 * @description 담당자 추가
 * @param       {Object} param
 */
ManagerSchema.statics.saveManager = function (param) {
    let {
        name,
        position,
        effStaDt,
        effEndDt,
        user
    } = param;

    const timestamp = new Timestamp({
        regId: user.profile.username,
        updId: user.profile.username
    });
    const manager = new this({ 
        name, 
        position, 
        effStaDt, 
        effEndDt,
        timestamp
    });

    return manager.save();
};

/**
 * @author      minz-logger
 * @date        2019. 10. 27
 * @description 담당자 수정
 * @param       {Object} param
 */
ManagerSchema.statics.editManager = function (param) {
    let {
        managerId,
        name,
        position,
        effStaDt,
        effEndDt,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: managerId },
        {
            $set: {
                name,
                position,
                effStaDt,
                effEndDt: effEndDt === '' ? '9999-12-31' : effEndDt,
                timestamp: {
                    updId: user.profile.username,
                    updDt: DEFINE.dateNow()
                }
            }
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 10. 28
 * @description 담당자 삭제
 * @param       {Object} param
 */
ManagerSchema.statics.deleteManager = function (param) {
    let {
        id,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                deleteYn: DEFINE.COMMON.DEFAULT_YES,
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

export default model('Manager', ManagerSchema);