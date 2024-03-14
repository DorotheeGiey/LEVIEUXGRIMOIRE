const mongoose =require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); /// package plugin qui permet de n'avoir un email unique dans la base de données

const userSchema = mongoose.Schema({
    email :{ type : String, required : true, unique :true },
    password : {type : String, required : true }
});

userSchema.plugin(uniqueValidator)  // avant d'exporter ce schema on applique le plugin aux données 

module.exports = mongoose.model ('User', userSchema);