const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

// main()
// .then(() => {
//     console.log("connection successful");
// })
// .catch((err) => {
//     console.log(err);
// })

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/Diary');
// }