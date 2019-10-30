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
 * @date        2019. 08. 05
 * @description 업체 검색
 * @param       {Object} param
 * @param       {Integer} page
 */
VendorSchema.statics.searchVendors = function (param, page) {
    const {
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
            $match: {
                $and: [
                    { vendorGb: { $regex: vendorGb + '.*', $options: 'i' } },
                    { countryCd: { $regex: countryCd + '.*', $options: 'i' } },
                    { vendorName: { $regex: vendorName + '.*', $options: 'i' } },
                    { officialName: { $regex: officialName + '.*', $options: 'i' } },
                    { 'part._id': part === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(part) },
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
            $project: {
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
            $match: {
                $and: [
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
        persons
    } = param;

    let ids = [];

    if (persons.length > 0)
        ids = await Person.savePersons(persons);

    const vendor = new this({ project, manager, vendorGb, countryCd, part, partNumber, vendorName, officialName, itemName, effStaDt, effEndDt, vendorPerson: ids });

    await vendor.save();

    return this.findOne({ _id: vendor._id }).populate({ path: 'part' }).populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 수정
 * @param       {String} id
 * @param       {Object} param
 */
VendorSchema.statics.editVendor = async function (id, param) {
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
        vendorPerson
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
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'part' }).populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 삭제
 * @param       {String} id
 */
VendorSchema.statics.deleteVendor = async function (param) {
    let {
        id,
        yn,
        reason
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
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'part' }).populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 추가
 * @param       {String} id
 * @param       {Object} param
 */
VendorSchema.statics.addPerson = async function (id, param) {
    const personId = await Person.savePersons(param);

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                vendorPerson: personId
            }
        },
        {
            new: true
        }
    ).populate({ path: 'part' }).populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 삭제
 * @param       {String} id
 * @param       {String} personId
 */
VendorSchema.statics.deletePerson = async function (id, personId) {
    return this.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                vendorPerson: personId
            }
        },
        {
            new: true
        }
    ).populate({ path: 'part' }).populate({ path: 'vendorPerson' });
};

export default model('Vendor', VendorSchema);