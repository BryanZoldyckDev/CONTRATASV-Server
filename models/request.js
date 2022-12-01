const {Schema, model} = require('mongoose');

const RequestSchema = Schema({
    offer: {
        type: Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    contratist: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: [true, 'Address method is required'],
    },
    workinghours: {
        type: String,
        required: [true, 'Working hours is required'],
    },
    startdate: {
        type: Date,
        required: [true, 'Starting date is required'],
        min: '2022-12-01',
        max: '2025-12-01'
    },
    enddate: {
        type: Date,
        required: [true, 'Starting date is required'],
        min: '2022-12-01',
        max: '2025-12-01'
    },
    status: {
        type: String,
        default: "PENDING",
    }
});

RequestSchema.methods.toJSON = function() {
    const {__v, ...data} = this.toObject();
    return data;
}

module.exports = model('Request', RequestSchema);