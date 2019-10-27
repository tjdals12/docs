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
 * @param       {Object} params
 */
ManagerSchema.statics.saveManager = function (params) {
    let {
        name,
        position,
        effStaDt,
        effEndDt
    } = params;

    const manager = new this({ name, position, effStaDt, effEndDt });

    return manager.save();
};

/**
 * @author      minz-logger
 * @date        2019. 10. 27
 * @description 담당자 수정
 * @param       {Object} params
 */
ManagerSchema.statics.editManager = function (params) {
    let {
        managerId,
        name,
        position,
        effStaDt,
        effEndDt
    } = params;

    return this.findOneAndUpdate(
        { _id: managerId },
        {
            $set: {
                name,
                position,
                effStaDt,
                effEndDt: effEndDt === '' ? '9999-12-31' : effEndDt
            }
        }
    );
};

export default model('Manager', ManagerSchema);