const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs")


const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email: { type: String, required: true, unique: true },
    avatar: {type:String,required:true},
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    course: {
        type: String,
        default: "other"
    }
})


// method to generate token 
userSchema.methods = {
    jwtToken() {
        return JWT.sign({ id: this._id, email: this.email }, process.env.SECRET, {
            expiresIn: '24h'
        })
    }
}

// to hash password before saving it
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12); //hashing password
    return next();
})

const UserModel = mongoose.model("user", userSchema) // USER MODEL

module.exports = {UserModel }