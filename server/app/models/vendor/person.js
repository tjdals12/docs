import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 업체 담당자
 */
const PersonSchema = new Schema({
    name: String,
    position: String,
    email: String,
    contactNumber: String,
    task: String,
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 추가
 * @param       {Object} param
 */
PersonSchema.statics.savePerson = async function (param) {
    const person = new this({ ...param });

    await person.save();

    return person._id;
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 추가
 * @param       {Array} param
 */
PersonSchema.statics.savePersons = async function (param) {
    let ids = [];

    while (param.length > 0) {
        const person = new this({ ...param.pop() });
        await person.save();
        ids.push(person._id);
    }

    return ids;
};

/**
 * @author      minz-logger
 * @date        2019. 10. 08
 * @description 담당자 수정
 * @param       {Object} param
 */
PersonSchema.statics.editPerson = async function (param) {
    let {
        oldVendorPerson,
        vendorPerson
    } = param;

    let ids = [];

    if (oldVendorPerson.length !== vendorPerson.length) {
        while (oldVendorPerson.length > 0) {
            const _id = oldVendorPerson.pop() + '';

            const target = vendorPerson.find(person => person._id === _id);

            if (target) {
                const { name, position, task, email, contactNumber } = target;

                await this.findByIdAndUpdate(
                    _id,
                    {
                        $set: {
                            name,
                            position,
                            task,
                            email,
                            contactNumber,
                            'timestamp.updDt': DEFINE.dateNow()
                        }
                    }
                );

                ids.push(_id);
            } else {
                await this.findByIdAndDelete(_id);
            }
        }
    } else {
        while (vendorPerson.length > 0) {
            const { _id, name, position, task, email, contactNumber } = vendorPerson.pop();

            await this.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        name,
                        position,
                        task,
                        email,
                        contactNumber,
                        'timestamp.updDt': DEFINE.dateNow()
                    }
                }
            );

            ids.push(_id);
        }
    }

    return ids;
};

export default model('Person', PersonSchema);