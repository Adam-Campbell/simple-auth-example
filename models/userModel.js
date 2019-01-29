const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        select: false
    },

    email: {
        type: String,
        select: false
    },

    memberSince: {
        type: Date,
        default: Date.now
    },

    // will only be present on profiles created via Google auth
    googleId: {
        type: String,
        select: false
    },

    // will only be present on profiles created via Facebook auth
    facebookId: {
        type: String,
        select: false
    }
});

// if the password has been modified, re-encrypt the password and save the hashed password string
// back on the user model. 
UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    this.password = this.encryptPassword(this.password);
    next();
});

// Handle the case where the chosen username has already been taken
UserSchema.post('save', function(error, doc, next) {
    if (error.name === 'BulkWriteError' && error.code === 11000) {
        return next(new Error('Duplicate username'));
    }
    next();
});

UserSchema.methods = {
    // check that hash of supplied password matches hashed password on user model
    authenticate: function(plainTextPword) {
        return bcrypt.compareSync(plainTextPword, this.password);
    },
    // hash the password
    encryptPassword: function(plainTextPword) {
        if (!plainTextPword) {
            return ''
        } else {
            const salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(plainTextPword, salt);
        }
    }
};

module.exports = mongoose.model('user', UserSchema);
