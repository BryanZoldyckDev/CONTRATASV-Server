const {Schema, model} = require('mongoose')

const professionSchema = Schema({
    name: {
        type: String,
        required: [true, 'Profession name is required']
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref:'User',
        require: true,
    }
});

professionSchema.methods.toJSON = function() {
    const {__v, status, ...profession} = this.toObject();
    return profession;
}


module.exports = model('Profession', professionSchema)