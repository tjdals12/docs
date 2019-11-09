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
        pwd,
        roles
    } = param;

    const user = new this({
        profile: {
            username,
            description,
            userType
        },
        userId,
        pwd: auth.hash(pwd),
        roles
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
 * @param       {String} userId
 */
UserSchema.statics.findByUserId = function (userId) {
    return this.findOne({
        userId: userId
    });
};

/**
 * @author      minz-logger
 * @date        2019. 11. 05
 * @description 계정 수정
 * @param       {String} id
 * @param       {Object} param
 */
UserSchema.statics.editUser = function (id, param) {
    let {
        username,
        description,
        userType,
        userId,
        roles
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                profile: {
                    username,
                    description,
                    userType
                },
                userId,
                roles
            }
        },
        {
            new: true,
            projection: {
                pwd: 0
            }
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 11. 07
 * @description 계정 삭제
 * @param       {Object} param
 */
UserSchema.statics.deleteUser = function (param) {
    let {
        id,
        yn
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                deleteYn: {
                    yn,
                    deleteDt: DEFINE.dateNow()
                }
            }
        },
        {
            new: true,
            projection: {
                pwd: 0
            }
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 비밀번호 검증
 * @param       {String} password
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
        profile: this.profile,
        roles: this.roles
    };

    return auth.generateToken(payload);
};

export default model('User', UserSchema);
