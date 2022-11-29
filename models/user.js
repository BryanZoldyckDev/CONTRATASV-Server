const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    img: {
        type: String,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    profession: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Profession'
    }],
    },
    dui: {
        type: String,
        required: [true, 'DUI is required'],
        unique: true,
        max: 10
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        unique: true,
        max: 9
    },
    birthdate: {
        type: Date,
        required: [true, 'Birthdate is required'],
        min: '1950-01-01',
        max: '2002-11-25'
    },
    residence: {
        type: String,
        required: [true, 'Residence is required'],
    },
    score: {
        type: Number,
        min: 0, 
        max: 5,
        default: 5,
    },
    description: {
        type: String,
        default: 'Está es mi descripción',
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

UserSchema.methods.toJSON = function() {
    const {__v, _id, password, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);