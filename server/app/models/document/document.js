import { Schema, model, Types } from 'mongoose';
import { Timestamp, Status } from 'models/common/schema';
import DEFINE from 'models/common';
import InOut from './inOut';
import HoldYn from './holdYn';
import deleteYn from './deleteYn';
import DocumentInfo from 'models/documentIndex/documentInfo';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서
 */
const DocumentSchema = new Schema({
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    documentNumber: String,
    documentTitle: String,
    documentInOut: [InOut.schema],
    documentGb: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    documentStatus: {
        type: [Status.schema],
        default: Status
    },
    documentRev: String,
    level: {
        type: Schema.Types.Mixed,
        default: 1,
        get: DEFINE.levelConverter
    },
    memo: String,
    holdYn: {
        type: [HoldYn.schema],
        default: HoldYn
    },
    deleteYn: {
        type: deleteYn.schema,
        default: deleteYn
    },
    chainingDocument: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

DocumentSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 08. 02
 * @description 문서 검색
 * @param       {Object} param
 * @param       {Integer} page
 */
DocumentSchema.statics.searchDocuments = async function (param, page) {
    const {
        documentGb,
        documentNumber,
        documentTitle,
        documentRev,
        documentStatus,
        deleteYn,
        holdYn,
        regDtSta,
        regDtEnd,
        level
    } = param;

    return this.aggregate([
        {
            $match: {
                $and: [
                    { documentGb: documentGb === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(documentGb) },
                    { documentNumber: { $regex: documentNumber + '.*', $options: 'i' } },
                    { documentTitle: { $regex: documentTitle + '.*', $options: 'i' } },
                    { documentRev: { $regex: documentRev + '.*', $options: 'i' } },
                    { 'deleteYn.yn': { $regex: deleteYn + '.*', $options: 'i' } },
                    {
                        holdYn: {
                            $elemMatch: {
                                yn: { $regex: holdYn + '.*', $options: 'i' }
                            }
                        }
                    },
                    {
                        $and: [
                            { 'timestamp.regDt': { $gte: new Date(regDtSta) } },
                            { 'timestamp.regDt': { $lte: new Date(regDtEnd) } }
                        ]
                    },
                    { level: level === -1 ? { $gte: level } : level }
                ]
            }
        },
        {
            $sort: { 'timestamp.regDt': -1 }
        },
        {
            $project: {
                vendor: 1,
                part: '$part',
                documentNumber: 1,
                documentTitle: 1,
                documentInOut: {
                    $slice: ['$documentInOut', -1]
                },
                documentGb: '$documentGb',
                documentStatus: {
                    $slice: ['$documentStatus', -1]
                },
                documentRev: 1,
                level: 1,
                memo: 1,
                holdYn: 1,
                deleteYn: 1,
                chainingDocument: 1,
                timestamp: 1
            },
        },
        {
            $match: {
                documentStatus: {
                    $elemMatch: {
                        status: { $regex: documentStatus + '.*', $options: 'i' }
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'cdminors',
                localField: 'documentGb',
                foreignField: '_id',
                as: 'documentGb'
            }
        },
        {
            $unwind: '$documentGb'
        },
        {
            $skip: (page - 1) * 10
        },
        {
            $limit: 10
        }
    ]).then((documents) => {
        return documents.map((document) => (
            {
                ...document,
                level: DEFINE.levelConverter(document.level)
            }
        ));
    });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 03
 * @description 문서 검색 카운트
 */
DocumentSchema.statics.searchDocumentsCount = function (param) {
    const {
        documentGb,
        documentNumber,
        documentTitle,
        documentRev,
        documentStatus,
        deleteYn,
        holdYn,
        regDtSta,
        regDtEnd,
        level
    } = param;

    return this.aggregate([
        {
            $match: {
                $and: [
                    { documentGb: documentGb === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(documentGb) },
                    { documentNumber: { $regex: documentNumber + '.*', $options: 'i' } },
                    { documentTitle: { $regex: documentTitle + '.*', $options: 'i' } },
                    { documentRev: { $regex: documentRev + '.*', $options: 'i' } },
                    { 'deleteYn.yn': { $regex: deleteYn + '.*', $options: 'i' } },
                    {
                        holdYn: {
                            $elemMatch: {
                                yn: { $regex: holdYn + '.*', $options: 'i' }
                            }
                        }
                    },
                    {
                        $and: [
                            { 'timestamp.regDt': { $gte: new Date(regDtSta) } },
                            { 'timestamp.regDt': { $lte: new Date(regDtEnd) } }
                        ]
                    },
                    { level: level === -1 ? { $gte: level } : level }
                ]
            }
        },
        {
            $sort: { 'timestamp.regDt': -1 }
        },
        {
            $project: {
                vendor: 1,
                part: '$part',
                documentNumber: 1,
                documentTitle: 1,
                documentInOut: {
                    $slice: ['$documentInOut', -1]
                },
                documentGb: '$documentGb',
                documentStatus: {
                    $slice: ['$documentStatus', -1]
                },
                documentRev: 1,
                level: 1,
                memo: 1,
                holdYn: 1,
                deleteYn: 1,
                chainingDocument: 1,
                timestamp: 1
            },
        },
        {
            $match: {
                documentStatus: {
                    $elemMatch: {
                        status: { $regex: documentStatus + '.*', $options: 'i' }
                    }
                }
            }
        },
        {
            $count: 'count'
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 추가
 * @param       {Object} param
 */
DocumentSchema.statics.saveDocument = async function (param) {
    let {
        vendor,
        part,
        documentNumber,
        documentTitle,
        documentGb,
        documentRev,
        officialNumber,
        memo,
        user
    } = param;

    const documentInOut = new InOut({ officialNumber });
    const timestamp = new Timestamp({ 
        regId: user.profile.username, 
        updId: user.profile.username
    });
    const document = new this({ 
        vendor, 
        part, 
        documentNumber: documentNumber.trim(), 
        documentTitle: documentTitle.trim(), 
        documentGb, 
        documentRev: documentRev.trim(), 
        documentInOut, 
        memo, 
        timestamp
    });

    await document.save();

    return this
        .findOne({ _id: document._id })
        .populate({ path: 'vendor', populate: { path: 'part vendorPerson' } })
        .populate({ path: 'part' })
        .populate({ path: 'documentGb ' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 24
 * @description 문서 추가
 * @param       {Array} param
 */
DocumentSchema.statics.saveDocuments = async function (param) {
    let ids = [];
    let fails = [];
    let targets = [];

    while (param.length > 0) {
        let {
            vendor,
            part,
            documentNumber,
            documentTitle,
            documentRev,
            officialNumber,
            memo,
            timestamp
        } = param.pop();

        let documentGb;

        try {
            const { documentGb: gb } = await DocumentInfo.findOne({
                $and: [
                    { vendor: vendor },
                    { documentNumber: documentNumber }
                ]
            });

            const isSaved = await this.findOne({
                $and: [
                    { vendor: { $eq: vendor } },
                    { documentNumber: { $eq: documentNumber } },
                    { documentRev: { $eq: documentRev } }
                ]
            });

            if (isSaved) throw new Error();

            documentGb = gb;
        } catch (e) {
            fails.push(documentNumber);
            continue;
        }

        const documentInOut = new InOut({ officialNumber, timestamp });
        const documentStatus = new Status({ timestamp });
        targets.push(new this({ 
            vendor, 
            part, 
            documentNumber: documentNumber.trim(), 
            documentTitle: documentTitle.trim(), 
            documentGb, 
            documentRev: documentRev.trim(), 
            documentInOut,
            documentStatus,
            memo: memo.trim(), 
            timestamp
        }));
    }

    if (fails.length > 0) throw fails;

    while (targets.length > 0) {
        const document = targets.pop();

        await document.save();
        await DocumentInfo.findOneAndUpdate(
            {
                $and: [
                    { vendor: document.vendor },
                    { documentNumber: document.documentNumber }
                ]
            },
            {
                $push: {
                    trackingDocument: document._id
                }
            });

        ids.push(document._id);
    }

    return ids;
};

/**
 * @author      minz-logger
 * @date        2019. 07. 23
 * @description 문서 수정
 * @param       {Object} param
 */
DocumentSchema.statics.editDocument = function (param) {
    let {
        id,
        vendor,
        part,
        documentNumber,
        documentTitle,
        documentGb,
        documentRev,
        level,
        officialNumber,
        memo,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                vendor,
                part,
                documentNumber: documentNumber.trim(),
                documentTitle: documentTitle.trim(),
                documentGb,
                documentRev: documentRev.trim(),
                level,
                officialNumber,
                memo,
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'vendor', populate: { path: 'part vendorPerson' } }).populate({ path: 'part' }).populate({ path: 'documentGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 삭제
 * @param       {Object} param
 */
DocumentSchema.statics.deleteDocument = function (param) {
    let {
        id,
        yn,
        reason,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                deleteYn: {
                    yn: yn,
                    deleteDt: DEFINE.dateNow(),
                    reason: reason
                },
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        })
        .populate({ path: 'vendor', populate: { path: 'part vendorPerson' } })
        .populate({ path: 'part' })
        .populate({ path: 'documentGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 01
 * @description 문서 일괄 삭제
 * @param       {Object} param
 */
DocumentSchema.statics.deleteDocuments = function (param) {
    let {
        ids,
        user
    } = param;

    return this.updateMany(
        { _id: { $in: ids } },
        {
            deleteYn: {
                yn: 'YES',
                deleteDt: DEFINE.dateNow(),
                reason: '일괄 삭제'
            },
            'timestamp.updId': user.profile.username,
            'timestamp.updDt': DEFINE.dateNow()
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 07. 22
 * @description 문서 In / Out
 * @param       {Object} param
 */
DocumentSchema.statics.inOutDocument = function (param) {
    let {
        id, 
        inOutGb, 
        officialNumber, 
        status, 
        resultCode, 
        replyCode, 
        date, 
        user
    } = param;

    const timestamp = new Timestamp({ 
        regId: user.profile.username,
        regDt: date,
        updId: user.profile.username,
        updDt: date
    });
    const newInOut = new InOut({ 
        inOutGb,
        officialNumber,
        timestamp 
    });
    const newStatus = new Status({ 
        _id: newInOut._id,
        status,
        statusName: status,
        resultCode, replyCode,
        timestamp
    });

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                documentInOut: newInOut,
                documentStatus: newStatus
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
        .populate({ path: 'vendor', populate: { path: 'part vendorPerson' } })
        .populate({ path: 'part' })
        .populate({ path: 'documentGb' });
};

/**
 * @author minz-logger
 * @description 문서 In / Out
 * @param       {Object} param
 */
DocumentSchema.statics.inOutDocuments = function (param) {
    let {
        ids, 
        inOutGb, 
        officialNumber, 
        status, 
        resultCode, 
        replyCode, 
        date, 
        user
    } = param;

    const timestamp = new Timestamp({ 
        regId: user.profile.username,
        regDt: date,
        updId: user.profile.username,
        updDt: date,
    });
    const newInOut = new InOut({ 
        inOutGb, 
        officialNumber, 
        timestamp
    });
    const newStatus = new Status({ 
        status, 
        statusName: status, 
        resultCode, 
        replyCode, 
        timestamp
    });

    return this.updateMany(
        { _id: { $in: ids } },
        {
            $push: {
                documentInOut: newInOut,
                documentStatus: newStatus
            },
            $set: {
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 07. 31
 * @description 문서 In / Out 삭제
 * @param       {Object} param
 */
DocumentSchema.statics.deleteInOutDocument = async function (param) {
    let {
        id, 
        targetId,
        user
    } = param;

    const target = await this.findOne({ _id: id })
        .populate({ path: 'vendor', populate: { path: 'part vendorPerson' } })
        .populate({ path: 'part' })
        .populate({ path: 'documentGb' });

    /** '접수' 상태는 삭제할 수 없음. */
    if(target.documentStatus[0]._id == targetId || target.documentInOut[0]._id == targetId) {
        return target;
    }

    return this.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                documentInOut: {
                    _id: targetId
                },
                documentStatus: {
                    _id: targetId
                }
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
        .populate({ path: 'vendor', populate: { path: 'part vendorPerson' } })
        .populate({ path: 'part' })
        .populate({ path: 'documentGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 23
 * @description 문서 보류
 * @param       {String} id
 * @param       {String} yn
 * @param       {String} reason
 */
DocumentSchema.statics.holdDocument = async function (param) {
    let {
        id,
        yn,
        reason,
        user
    } = param;

    const newHoldYn = new HoldYn({ yn, reason });

    await this.findOneAndUpdate(
        {
            $and: [
                { _id: id },
                {
                    holdYn: {
                        $elemMatch: {
                            effEndDt: DEFINE.COMMON.MAX_END_DT
                        }
                    }
                }
            ]
        },
        {
            $set: {
                'holdYn.$.effEndDt': DEFINE.dateNow(),
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        }
    );

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                holdYn: newHoldYn
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
        .populate({ path: 'vendor', populate: { path: 'part vendorPerson' } })
        .populate({ path: 'part' })
        .populate({ path: 'documentGb' });
};

export default model('Document', DocumentSchema);