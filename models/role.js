const {Schema, model} = require('mongoose')


const RoleSchema = Schema({
    name: {
        type: String,
        required: [true, 'Role name is required']
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
});

RoleSchema.methods.toJSON = function() {
    const {__v, status,...role} = this.toObject();
    return role;
}

module.exports = model('Role', RoleSchema)