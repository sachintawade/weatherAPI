const mongoose = require("mongoose");

let weatherModel = mongoose.Schema({
    coord: {
        type: Object,
    },
    temperature: {
        type: Object,
    },
    city_name: {
        type: String,
    },
});

const Weather = mongoose.model("weather", weatherModel, "weather");

module.exports = Weather;