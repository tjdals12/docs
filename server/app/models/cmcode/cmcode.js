import { Schema, model } from 'mongoose';
import CdMinor from './cdMinor';
import Timestamp from 'models/common/schema/Timestamp';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 20
 * @description 공통코드 (상위)
 */
const CmcodeSchema = new Schema({
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
    cdMajor: {
        type: String,
        required: true
    },
    cdFName: String,
    cdMinors: [{
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    }],
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 상위 공통코드 생성
 * @param       {Object} param
 */
CmcodeSchema.statics.saveCmcodeMajor = function (param) {
    let {
        cdMajor,
        cdFName,
        user
    } = param;

    const timestamp = new Timestamp({
        regId: user.profile.username,
        updId: user.profile.username
    });
    const cmcode = this({
        cdMajor, 
        cdFName, 
        timestamp
    });

    cmcode.save();

    return cmcode;
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 하위 공통코드 추가
 * @param       {Object} param
 */
CmcodeSchema.statics.saveCmcodeMinor = async function (param) {
    let {
        id,
        cdMinor,
        cdSName,
        cdRef1,
        user
    } = param;

    const { _id: newId } = await CdMinor.saveCdMinor({ 
        cdMinor, 
        cdSName, 
        cdRef1,
        user
    });

    return this.findByIdAndUpdate(
        id,
        {
            $push: {
                cdMinors: newId
            },
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

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 상위 공통코드 수정
 * @param       {Object} param
 */
CmcodeSchema.statics.editCmcode = function (param) {
    let {
        id,
        cdMajor,
        cdFName,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                cdMajor,
                cdFName,
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

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 하위 공통코드 수정
 * @param       {Object} param
 */
CmcodeSchema.statics.editMinor = async function (param) {
    let {
        id,
        minorId,
        cdMinor,
        cdSName,
        user
    } = param;

    await CdMinor.editCdMinor({ id: minorId, cdMinor, cdSName, user });

    return this.findOne({ _id: id })
        .populate({ path: 'cdMinors', match: { _id: minorId } });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 상위 공통코드 삭제
 * @param       {Object} param
 */
CmcodeSchema.statics.deleteCmcode = function (param) {
    let {
        id,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                effEndDt: DEFINE.dateNow(),
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

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 하위 공통코드 삭제
 * @param       {Object} param
 */
CmcodeSchema.statics.deleteCdMinor = async function (param) {
    let {
        id,
        minorId,
        user
    } = param;

    await CdMinor.deleteCdMinor({ id: minorId, user });

    return this.findOne({ _id: id })
        .populate({ path: 'cdMinors' });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 09
 * @description 하위 공통코드 복구
 * @param       {Object} param
 */
CmcodeSchema.statics.recoveryCdMinor = async function (param) {
    let {
        id,
        minorId,
        user
    } = param;

    await CdMinor.recoveryCdMinor({ id: minorId, user });

    return this.findOne({ _id: id })
        .populate({ path: 'cdMinors' });
};

export default model('Cmcode', CmcodeSchema);