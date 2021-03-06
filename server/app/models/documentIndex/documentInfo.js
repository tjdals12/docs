import { Schema, model, Types } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import removeYn from 'models/documentIndex/removeYn';
import document from '../document/document';

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 문서 정보
 */
const DocumentInfoSchema = new Schema({
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    documentNumber: String,
    documentTitle: String,
    documentGb: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    plan: {
        type: Date,
        default: new Date(DEFINE.COMMON.MAX_END_DT),
        get: DEFINE.dateConverter
    },
    trackingDocument: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
    removeYn: {
        type: removeYn.schema,
        default: removeYn
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

DocumentInfoSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 08. 26
 * @description 문서정보 검색
 * @param       {Object} param
 * @param       {Number} page
 */
DocumentInfoSchema.statics.searchDocumentInfos = async function (param, page) {
    let {
        vendor,
        documentNumber,
        documentTitle,
        documentGb
    } = param;

    return this.find(
        {
            $and: [
                { vendor: vendor === '' ? { $ne: DEFINE.COMMON.NONE_ID } : vendor },
                { documentNumber: { $regex: documentNumber + '.*', $options: 'i' } },
                { documentTitle: { $regex: documentTitle + '.*', $options: 'i' } },
                { documentGb: documentGb === '' ? { $ne: DEFINE.COMMON.NONE_ID } : documentGb }
            ]
        })
        .skip((page - 1) * 10)
        .limit(10)
        .sort({ 'timestamp.regDt': -1 })
        .populate({ path: 'vendor', populate: { path: 'part' } })
        .populate({ path: 'documentGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 11. 17
 * @description 문서정보 검색 for export
 * @param       {Object} param
 */
DocumentInfoSchema.statics.searchDocumentInfosForExport = async function (param) {
    // TODO: 쿼리 최적화
    let {
        vendor,
        documentNumber,
        documentTitle,
        documentGb
    } = param;

    return this.aggregate([
        {
            $match: {
                $and: [
                    { vendor: vendor === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(vendor) },
                    { documentNumber: { $regex: documentNumber + '.*', $options: 'i' } },
                    { documentTitle: { $regex: documentTitle + '.*', $options: 'i' } },
                    { documentGb: documentGb === '' ? { $ne: DEFINE.COMMON.NONE_ID } : documentGb }
                ]
            }
        },
        {
            $lookup: {
                from: 'vendors',
                localField: 'vendor',
                foreignField: '_id',
                as: 'vendor'
            }
        },
        {
            $unwind: '$vendor'
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
            $lookup: {
                from: 'cdminors',
                localField: 'vendor.part',
                foreignField: '_id',
                as: 'vendor.part'
            }
        },
        {
            $unwind: '$vendor.part'
        },
        {
            $unwind: '$documentGb'
        },
        {
            $lookup: {
                from: 'documents',
                localField: 'trackingDocument',
                foreignField: '_id',
                as: 'trackingDocument'
            }
        },
        {
            $unwind: {
                path: '$trackingDocument',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                'Vendor': { $concat: [ '$vendor.vendorName', ' (', '$vendor.partNumber', ')' ] },
                'No': '$documentNumber',
                'Description': '$documentTitle',
                'Plan': '$plan',
                '구분': '$documentGb.cdSName',
                'Rev': '$trackingDocument.documentRev',
                '삭제여부': '$removeYn.yn',
                'Status': { $arrayElemAt: [{ $slice: [ '$trackingDocument.documentStatus.statusName', -1 ] }, 0]},
                '취소여부': '$trackingDocument.deleteYn.yn',
                '보류여부': { $arrayElemAt: [{ $slice: [ '$trackingDocument.holdYn.yn', -1 ] }, 0]},
                '등록자': '$timestamp.regId',
                '등록일': '$timestamp.regDt',
                '수정자': '$timestamp.updId',
                '수정일': '$timestamp.updDt',
            }
        }
    ]);
};

/**
 * @author minz-logger
 * @date 2019. 08. 26
 * @description 문서정보 검색 카운트
 */
DocumentInfoSchema.statics.searchDocumentInfosCount = async function (param) {
    let {
        vendor,
        documentNumber,
        documentTitle,
        documentGb
    } = param;

    return this.countDocuments(
        {
            $and: [
                { vendor: vendor === '' ? { $ne: DEFINE.COMMON.NONE_ID } : vendor },
                { documentNumber: { $regex: documentNumber + '.*', $options: 'i' } },
                { documentTitle: { $regex: documentTitle + '.*', $options: 'i' } },
                { documentGb: documentGb === '' ? { $ne: DEFINE.COMMON.NONE_ID } : documentGb }
            ]
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 문서 정보 추가
 * @param       {Object} param
 */
DocumentInfoSchema.statics.saveDocumentInfos = async function (param) {
    let {
        id,
        list,
        user
    } = param;

    let ids = [];

    const timestamp = new Timestamp({
        regId: user.profile.username,
        updId: user.profile.username,
    });

    for (let i = 0; i < list.length; i++) {
        const { documentNumber, documentTitle, documentGb, plan } = list[i];
        const documentInfo = new this({ 
            vendor: id, 
            documentNumber, 
            documentTitle, 
            documentGb, 
            plan: new Date(plan), 
            timestamp
        });
        await documentInfo.save();
        ids.push(documentInfo._id);
    }

    return ids;
};

/**
 * @author      minz-logger
 * @date        2019. 08. 16
 * @description 문서 정보 수정
 * @param       {Object} param
 */
DocumentInfoSchema.statics.updateDocumentInfos = async function (param) {
    let {
        id,
        list,
        user
    } = param;

    let ids = [];

    for (let i = 0; i < list.length; i++) {
        const { _id, documentNumber, documentTitle, documentGb, plan } = list[i];

        if (!_id) {
            const documentInfo = new this({ vendor: id, documentNumber, documentTitle, documentGb, plan });
            await documentInfo.save();

            ids.push(documentInfo._id);
        } else {
            const documentInfo = await this.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        documentNumber,
                        documentTitle,
                        documentGb,
                        plan,
                        removeYn: {
                            yn: DEFINE.COMMON.DEFAULT_NO,
                            deleteDt: new Date(DEFINE.COMMON.MAX_END_DT),
                            reason: DEFINE.COMMON.DEFAULT_REASON
                        },
                        'timestamp.updId': user.profile.username,
                        'timestamp.updDt': DEFINE.dateNow()
                    }
                },
                {
                    new: true
                }
            );

            await document.updateMany(
                { _id: { $in: documentInfo.trackingDocument } },
                {
                    documentGb: documentGb,
                    'timestamp.updId': user.profile.username,
                    'timestamp.updDt': DEFINE.dateNow()
                }
            );
        }
    }

    return ids;
};

/**
 * @author      minz-logger
 * @date        2019. 08. 16
 * @description 문서 정보 삭제
 * @param       {Object} param
 */
DocumentInfoSchema.statics.deleteDocumentInfos = async function (param) {
    let {
        list,
        user 
    } = param;

    for (let i = 0; i < list.length; i++) {
        const { _id, reason = '인덱스 수정' } = list[i];

        await this.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    removeYn: {
                        yn: DEFINE.COMMON.DEFAULT_YES,
                        deleteDt: DEFINE.dateNow(),
                        reason
                    },
                    'timestamp.updId': user.profile.username,
                    'timestamp.updDt': DEFINE.dateNow()
                }
            }
        );
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서 정보 삭제
 * @param       {Object} param
 */
DocumentInfoSchema.statics.deleteDocumentInfo = function (param) {
    let {
        id,
        reason,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                removeYn: {
                    yn: DEFINE.COMMON.DEFAULT_YES,
                    deleteDt: DEFINE.dateNow(),
                    reason: reason
                },
                'timestamp.updId': user.profile.username,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'trackingDocument' });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 24
 * @description 최신 문서 목록 조회
 * @param       {String} vendor
 * @param       {Number} page
 */
DocumentInfoSchema.statics.latestDocuments = function (vendor, page) {
    return this.aggregate([
        {
            $match: {
                vendor: Types.ObjectId(vendor)
            }
        },
        {
            $project: {
                documentNumber: 1,
                documentTitle: 1,
                latestDocument: {
                    $arrayElemAt: [{ $slice: ['$trackingDocument', -1] }, -1]
                }
            }
        },
        {
            $lookup: {
                from: 'documents',
                localField: 'latestDocument',
                foreignField: '_id',
                as: 'latestDocument'
            }
        },
        {
            $unwind: {
                path: '$latestDocument',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                documentNumber: 1,
                documentTitle: 1,
                latestDocument: {
                    documentRev: 1,
                    documentInOut: {
                        $arrayElemAt: [{ $slice: ['$latestDocument.documentInOut', 1] }, -1]
                    },
                    documentStatus: {
                        $arrayElemAt: [{ $slice: ['$latestDocument.documentStatus', -1] }, -1]
                    }
                }
            }
        },
        {
            $skip: (page - 1) * 30
        },
        {
            $limit: 30
        }
    ]).then(documents => {
        return documents.map((document, index) => {
            return {
                ...document,
                index: (index + 1) + ((page - 1) * 30)
            };
        });
    });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 30
 * @description 최신 목록 조회 카운트
 * @param       {String} vendor
 */
DocumentInfoSchema.statics.latestDocumentsCount = function (vendor) {
    return this.aggregate([
        {
            $match: {
                vendor: Types.ObjectId(vendor)
            }
        },
        {
            $project: {
                documentNumber: 1,
                documentTitle: 1,
                latestDocument: {
                    $arrayElemAt: [{ $slice: ['$trackingDocument', -1] }, -1]
                }
            }
        },
        {
            $lookup: {
                from: 'documents',
                localField: 'latestDocument',
                foreignField: '_id',
                as: 'latestDocument'
            }
        },
        {
            $unwind: {
                path: '$latestDocument',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                documentNumber: 1,
                documentTitle: 1,
                latestDocument: {
                    documentRev: 1,
                    documentInOut: {
                        $arrayElemAt: [{ $slice: ['$latestDocument.documentInOut', 1] }, -1]
                    },
                    documentStatus: {
                        $arrayElemAt: [{ $slice: ['$latestDocument.documentStatus', -1] }, -1]
                    }
                }
            }
        },
        {
            $count: 'count'
        }
    ]);
};

export default model('DocumentInfo', DocumentInfoSchema);