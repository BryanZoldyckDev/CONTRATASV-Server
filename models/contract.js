const {Schema, model} = require('mongoose');

const ContractSchema = Schema({
    request: {
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    status: {
        type: String,
        default: "IN PROGRESS",
    }
});

ContractSchema.methods.toJSON = function() {
    const {__v, ...data} = this.toObject();
    return data;
}

module.exports = model('Contract', ContractSchema);