const {Schema, model} = require('mongoose');

const OfferSchema = Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    contratist: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cost: {
        type: String,
    },
    payment: {
        type: String,
        required: [true, 'Payment method is required'],
    },
    payday: {
        type: String,
        required: [true, 'Paytime is required'],
    },
    profession: {
        type: Schema.Types.ObjectId,
        ref: 'Profession',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        max:10,
        min:150
    },
    area: {
        type: String,
        required: [true, 'Area is required'],
    },
    status: {
        type: Boolean,
        default: true,
    }
});

OfferSchema.methods.toJSON = function() {
    const {__v, status, ...data} = this.toObject();
    return data;
}

module.exports = model('Offer', OfferSchema);