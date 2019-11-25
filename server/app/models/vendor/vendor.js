import { Schema, model, Types } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import Person from './person';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 업체
 */
const VendorSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
    },
    vendorGb: {
        type: String,
        default: DEFINE.VENDOR_GB.CONTRACT,
        get: DEFINE.vendorGbConverter
    },
    vendorName: String,
    vendorPerson: [{
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }],
    officialName: String,
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    partNumber: {
        type: String,
        unique: true
    },
    itemName: String,
    countryCd: {
        type: String,
        default: DEFINE.COUNTRY_CD.DOMESTIC,
        get: DEFINE.countryCodeConverter
    },
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
    trackingTransmittal: [Schema.Types.ObjectId],
    deleteYn: {
        yn: {
            type: String,
            default: 'NO'
        },
        deleteDt: {
            type: Date,
            default: new Date(DEFINE.COMMON.MAX_END_DT),
            get: DEFINE.dateConverter
        },
        reason: {
            type: String,
            default: DEFINE.COMMON.DEFAULT_REASON
        }
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

VendorSchema.set('toJSON', { getters: true, virtuals: true });

/**
 * @author      minz-logger
 * @date        2019. 08. 14
 * @description 필드 추가 - 계약일수, 경과일수, 남은 달, 계약경과율
 */
VendorSchema.virtual('period').get(function () {
    return DEFINE.datePeriod(this.effStaDt, this.effEndDt);
});

/**
 * @author      minz-logger
 * @date        2019. 11. 22
 * @description 공정별 업체 수
 */
VendorSchema.statics.vendorsCountGroupByPart = function (project) { 
    return this.aggregate([
        {
            $match: {
                project: Types.ObjectId(project)
            }
        },
        {
            $project: {
                _id: 0,
                part: 1,
            }
        },
        {
            $group: {
                _id: '$part',
                total: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'cdminors',
                localField: '_id',
                foreignField: '_id',
                as: '_id'
            }
        },
        {
            $unwind: '$_id'
        },
        {
            $project: {
                _id: 0,
                name: '$_id.cdSName',
                value: '$total'
            }
        },
        {
            $sort: {
                name: 1
            }
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 11. 22
 * @description 계약시작일 + 공정별 업체수
 */
VendorSchema.statics.vendorsCountGroupByStartDt = function (project) {
    return this.aggregate([
        {
            $match: {
                project: Types.ObjectId(project)
            }
        },
        {
            $project: {
                part: 1,
                effStaDt: { $substr: [ '$effStaDt', 0, 7 ] },
            }
        },
        {
            $group: {
                _id: {
                    effStaDt: '$effStaDt',
                    part: '$part'
                },
                part: { $push: '$part' }
            }
        },
        {
            $project: {
                _id: 0,
                effStaDt: '$_id.effStaDt',
                parts: {
                    _id: '$_id.part',
                    count: { $size: '$part' }
                }
            }
        },
        {
            $lookup: {
                from: 'cdminors',
                localField: 'parts._id',
                foreignField: '_id',
                as: 'parts._id'
            }
        },
        {
            $unwind: '$parts._id'
        },
        {
            $project: {
                effStaDt: 1,
                parts: {
                    part: '$parts._id.cdSName',
                    count: '$parts.count'
                }
            }
        },
        {
            $group: {
                _id: '$effStaDt',
                parts: { $push: '$parts' }
            }
        },
        {
            $sort: {
                _id: 1,

            }
        }
    ]).then((response) => {
        return response.map(({ _id, parts }) => {
            const data = parts.reduce((acc, cur) => Object.assign(acc, { [cur.part]: cur.count }), {});

            return { name: _id, ...data };
        });
    });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 05
 * @description 업체 검색
 * @param       {Object} param
 * @param       {Integer} page
 */
VendorSchema.statics.searchVendors = function (param, page) {
    const {
        project,
        manager,
        vendorGb,
        countryCd,
        vendorName,
        officialName,
        part,
        partNumber,
        effStaDt,
        effEndDt
    } = param;

    return this.aggregate([
        {
            $match: {
                $and: [
                    { project: project === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(project) },
                    { manager: manager === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(manager) },
                    { vendorGb: { $regex: vendorGb + '.*', $options: 'i' } },
                    { countryCd: { $regex: countryCd + '.*', $options: 'i' } },
                    { vendorName: { $regex: vendorName + '.*', $options: 'i' } },
                    { officialName: { $regex: officialName + '.*', $options: 'i' } },
                    { part: part === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(part) },
                    { partNumber: { $regex: partNumber + '.*', $options: 'i' } },
                    {
                        $and: [
                            { effStaDt: { $gte: new Date(effStaDt) } },
                            { effEndDt: { $lte: new Date(effEndDt) } }
                        ]
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'cdminors',
                localField: 'part',
                foreignField: '_id',
                as: 'part'
            }
        },
        {
            $unwind: '$part'
        },
        {
            $project: {
                project: 1,
                manager: 1,
                vendorGb: {
                    $cond: {
                        if: { $eq: ['$vendorGb', '01'] },
                        then: '계약',
                        else: '관리'
                    }
                },
                vendorName: 1,
                vendorPerson: 1,
                officialName: 1,
                part: 1,
                partNumber: 1,
                countryCd: {
                    $cond: {
                        if: { $eq: ['$countryCd', '01'] },
                        then: '국내',
                        else: '해외'
                    }
                },
                effStaDt: 1,
                effEndDt: 1
            }
        },
        {
            $skip: (page - 1) * 8
        },
        {
            $limit: 8
        },
        {
            $sort: { 'timestamp.regDt': -1 }
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 08. 05
 * @description 업체 검색 카운트
 * @param       {Object} param
 */
VendorSchema.statics.searchVendorsCount = function (param) {
    const {
        project,
        manager,
        vendorGb,
        countryCd,
        vendorName,
        officialName,
        part,
        partNumber,
        effStaDt,
        effEndDt
    } = param;

    return this.aggregate([
        {
            $match: {
                $and: [
                    { project: project === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(project) },
                    { manager: manager === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(manager) },
                    { vendorGb: { $regex: vendorGb + '.*', $options: 'i' } },
                    { countryCd: { $regex: countryCd + '.*', $options: 'i' } },
                    { vendorName: { $regex: vendorName + '.*', $options: 'i' } },
                    { officialName: { $regex: officialName + '.*', $options: 'i' } },
                    { part: part === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(part) },
                    { partNumber: { $regex: partNumber + '.*', $options: 'i' } },
                    {
                        $and: [
                            { effStaDt: { $gte: new Date(effStaDt) } },
                            { effEndDt: { $lte: new Date(effEndDt) } }
                        ]
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'cdminors',
                localField: 'part',
                foreignField: '_id',
                as: 'part'
            }
        },
        {
            $unwind: '$part'
        },
        {
            $project: {
                project: 1,
                manager: 1,
                vendorGb: 1,
                vendorName: 1,
                vendorPerson: 1,
                officialName: 1,
                part: '$part',
                partNumber: 1,
                countryCd: 1,
                effStaDt: 1,
                effEndDt: 1
            }
        },
        {
            $count: 'count'
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 추가
 * @param       {Object} param
 */
VendorSchema.statics.saveVendor = async function (param) {
    let {
        project,
        manager,
        vendorGb,
        countryCd,
        part,
        partNumber,
        vendorName,
        officialName,
        itemName,
        effStaDt,
        effEndDt,
        persons,
        user
    } = param;

    let ids = [];

    if (persons.length > 0)
        ids = await Person.savePersons(persons);

    const timestamp = new Timestamp({
        regId: user.profile.username,
        updId: user.profile.username,
    });
    const vendor = new this({ 
        project, 
        manager, 
        vendorGb, 
        countryCd, 
        part, 
        partNumber, 
        vendorName, 
        officialName, 
        itemName, 
        effStaDt, 
        effEndDt, 
        vendorPerson: ids,
        timestamp
    });

    await vendor.save();

    return this.findOne({ _id: vendor._id })
        .populate({ path: 'part' })
        .populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 수정
 * @param       {Object} param
 */
VendorSchema.statics.editVendor = async function (param) {
    let {
        id,
        project,
        manager,
        vendorGb,
        countryCd,
        part,
        partNumber,
        vendorName,
        officialName,
        itemName,
        effStaDt,
        effEndDt,
        vendorPerson,
        user
    } = param;

    const { vendorPerson: oldVendorPerson } = await this.findOne({ _id: id });

    const persons = await Person.editPerson({ oldVendorPerson, vendorPerson });

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                project,
                manager,
                vendorGb,
                countryCd,
                part,
                partNumber,
                vendorName,
                officialName,
                itemName,
                effStaDt: new Date(effStaDt),
                effEndDt: new Date(effEndDt),
                vendorPerson: persons,
                timestamp: {
                    updId: user.profile.username,
                    updDt: DEFINE.dateNow()
                }
            }
        },
        {
            new: true
        }
    )
        .populate({ path: 'part' })
        .populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 삭제
 * @param       {Object} param
 */
VendorSchema.statics.deleteVendor = async function (param) {
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
                    yn,
                    deleteDt: DEFINE.dateNow(),
                    reason
                },
                timestamp: {
                    updId: user.profile.username,
                    updDt: DEFINE.dateNow()
                }
            }
        },
        {
            new: true
        }
    )
        .populate({ path: 'part' })
        .populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 추가
 * @param       {Object} param
 */
VendorSchema.statics.addPerson = async function (param) {
    let {
        id,
        persons,
        user
    } = param;

    const personId = await Person.savePersons(persons);

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                vendorPerson: personId
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
    )
        .populate({ path: 'part' })
        .populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 삭제
 * @param       {Object} param
 */
VendorSchema.statics.deletePerson = async function (param) {
    let {
        id,
        personId,
        user
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                vendorPerson: personId
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
    )
        .populate({ path: 'part' })
        .populate({ path: 'vendorPerson' });
};

export default model('Vendor', VendorSchema);