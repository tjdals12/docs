import { Schema, model } from 'mongoose';
import Timestamp from 'models/common/schema/Timestamp';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 (하위)
 */
const CdMinorSchema = new Schema({
    cdMinor: String,
    cdSName: String,
    cdRef1: Object,
    effStaDt: {
        type: Date,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    },
    effEndDt: {
        type: Date,
        default: new Date(DEFINE.COMMON.MAX_END_DT),
        get: DEFINE.dateConverter
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

/**
 * @author      minz-logger
 * @date        2019. 07. 30
 * @description 하위 공통코드 저장
 * @param       {Object} param
 */
CdMinorSchema.statics.saveCdMinor = async function (param) {
    let {
        cdMinor,
        cdSName,
        cdRef1,
        user
    } = param;

    const timestamp = new Timestamp({
        regId: user.profile.username,
        updId: user.profile.username
    });
    const newCdMinor = this({ 
        cdMinor, 
        cdSName, 
        cdRef1,
        timestamp 
    });
    return newCdMinor.save();
};

/**
 * @author      minz-logger
 * @date        2019. 07. 30
 * @description 하위 공통코드 수정
 * @param       {Object} param
 */
CdMinorSchema.statics.editCdMinor = function (param) {
    let {
        id,
        cdMinor,
        cdSName,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                cdMinor: cdMinor,
                cdSName: cdSName,
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 07. 30
 * @description 하위 공통코드 삭제
 * @param       {Object} param
 */
CdMinorSchema.statics.deleteCdMinor = function (param) {
    let { 
        id,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                effEndDt: DEFINE.dateNow(),
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 10. 09
 * @description 하위 공통코드 복구
* @param       {Object} param
 */
CdMinorSchema.statics.recoveryCdMinor = function (param) {
    let { 
        id,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                effEndDt: new Date(DEFINE.COMMON.MAX_END_DT),
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    );
};

export default model('Cdminor', CdMinorSchema);