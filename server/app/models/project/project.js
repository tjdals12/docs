import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 09. 23
 * @description 프로젝트
 */
const ProjectSchema = new Schema({
    projectGb: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    projectName: String,
    projectCode: String,
    effStaDt: {
        type: Date,
        get: DEFINE.dateConverter
    },
    effEndDt: {
        type: Date,
        get: DEFINE.dateConverter
    },
    client: String,
    clientCode: String,
    contractor: String,
    contractorCode: String,
    memo: String,
    deleteYn: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_NO
    },
    isMain: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

ProjectSchema.set('toJSON', { getters: true });

ProjectSchema.virtual('projectPeriod').get(function() {
    const period = DEFINE.getDatePeriod(this.effStaDt, this.effEndDt, 'days');
    const untilNow = DEFINE.getDatePeriod(this.effStaDt, new Date(), 'days');
    const percentage = Math.ceil((untilNow / period) * 100);

    return {
        period,
        untilNow,
        percentage: percentage > 100 ? 100 : percentage
    };
});

/**
 * @author      minz-logger
 * @date        2019. 09. 23
 * @description 프로젝트 추가
 * @param       {Object} param
 */
ProjectSchema.statics.saveProject = async function (param) {
    let {
        projectGb,
        projectName,
        projectCode,
        effStaDt,
        effEndDt,
        client,
        clientCode,
        contractor,
        contractorCode,
        memo
    } = param;

    const project = new this({
        projectGb, projectName, projectCode, effStaDt, effEndDt, client, clientCode, contractor, contractorCode, memo
    });

    await project.save();

    return this
        .findOne({ _id: project._id })
        .populate({ path: 'projectGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 24
 * @description 프로젝트 수정
 * @param       {String} id
 * @param       {Object} param
 */
ProjectSchema.statics.editProject = function (id, param) {
    let {
        projectGb,
        projectName,
        projectCode,
        effStaDt,
        effEndDt,
        client,
        clientCode,
        contractor,
        contractorCode,
        memo
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                projectGb,
                projectName,
                projectCode,
                effStaDt,
                effEndDt,
                client,
                clientCode,
                contractor,
                contractorCode,
                memo,
                'timestamp.uptDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'projectGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 10. 10
 * @description 프로젝트 삭제
 * @param       {Object} param
 */
ProjectSchema.statics.deleteProject = function (param) {
    let {
        id,
        yn
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                deleteYn: yn
            }
        },
        {
            new: true
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 11. 24
 * @description 메인 프로젝트 변경
 * @param       {String} id 
 */
ProjectSchema.statics.changeMainProject = async function (id) {
    const project = await this.findOne({ _id: id  });

    if(!project)
        throw new Error('존재하지 않는 프로젝트입니다.');

    await this.updateMany(
        {},
        {
            $set: {
                isMain: false
            }
        }
    );

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                isMain: true
            }
        },
        {
            new: true
        }
    );
};

export default model('Project', ProjectSchema);