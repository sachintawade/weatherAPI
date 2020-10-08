const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
const dotenv = require("dotenv");
dotenv.config();

var connect = function() {
    mongoose
        .connect(
            "mongodb+srv://root:" +
            process.env.MONGO_PASS +
            "@cluster0.d983i.mongodb.net/test?retryWrites=true&w=majority", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        .then(() => {
            console.log("DB connected successfully");
        })
        .catch(console.log);
};
module.exports.mongoose = mongoose;
module.exports.connect = connect;