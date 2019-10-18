import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';

/**
 * @author      minz-logger
 * @date        2019. 10. 18
 * @description 권한
 */
const RoleSchema = new Schema({
    path: String,
    description: String,
    role: {
        type: String,
        enum: ['READ', 'WRITE']
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

export default model('Role', RoleSchema);