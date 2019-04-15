const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name :{ type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    //email_verified :{ type: Boolean, required:true, default: false },
    //key_for_verify :{ type:Boolean, require:true, default:false },
    isAdmin: { type: Boolean, default: false }
});


module.exports = mongoose.model("User", userSchema);
