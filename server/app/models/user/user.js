import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import * as auth from 'utils/auth';

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 회원
 */
const UserSchema = new Schema({
    profile: {
        thumbnail: {
            type: String,
            default: 'http://minz-log-image.s3-ap-northeast-2.amazonaws.com/default_profile.png'
        },
        username: String,
        description: String,
        userType: String
    },
    userId: {
        type: String,
        unique: true
    },
    pwd: String,
    history: {
        type: Array,
        default: []
    },
    roles: {
        type: Array,
        default: []
    },
    notifications: {
        type: Array,
        default: []
    },
    deleteYn: {
        yn: {
            type: String,
            default: DEFINE.COMMON.DEFAULT_NO
        },
        deleteDt: {
            type: Date,
            default: DEFINE.dateNow,
            get: DEFINE.dateConverter
        }
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

UserSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 계정 추가
 */
UserSchema.statics.createUser = async function (param) {
    let {
        username,
        description,
        userType,
        userId,
        pwd
    } = param;

    const user = new this({
        profile: {
            username,
            description,
            userType
        },
        userId,
        pwd: auth.hash(pwd)
    });

    await user.save();

    return {
        _id: user._id,
        profile: user.profile
    };
};

/**
 * @author minz-logger
 * @date 2019. 10. 18
 * @description UserId로 계정 조회
 */
UserSchema.statics.findByUserId = function (userId) {
    return this.findOne({
        userId: userId
    });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 비밀번호 검증
 */
UserSchema.methods.validatePassword = function (password) {
    return this.pwd === auth.hash(password);
};

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 토근 발급
 */
UserSchema.methods.generateToken = function () {
    const payload = {
        _id: this._id,
        profile: this.profile
    };

    return auth.generateToken(payload);
};

export default model('User', UserSchema);
