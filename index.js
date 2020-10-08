const express = require("express");
const bodyParser = require("body-parser");
var app = express();
const request = require("request");
var path = require("path");
const mongoDB = require("./database");
mongoDB.connect();

let Weather = require("./weatherModel");

require("dotenv").config();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.send("App Started!!!!");
});

app.post("/getWeather", async(req, res) => {
    //* Get current Day */
    let currentDay = new Date().getDate();
    console.log("Current Day \n", currentDay);

    //* Check Whether it is prime number or not */
    let checkPrime = await isPrime(currentDay);

    console.log("Prime Checker Result \n", checkPrime);

    if (checkPrime) {
        let cityName = req.body.city_name || process.env.CITY_NAME;

        console.log("City Name \n", cityName);

        let reqUrl = process.env.URL + cityName + "&appid=" + process.env.API_KEY;

        //* Getting Weather Data from api */
        request(reqUrl, async function(err, response, body) {
            if (err) {
                console.log("Error :\n", err);
                res.status(500).send({
                    code: 500,
                    content: null,
                    message: "Internal Server Error",
                    error: err,
                });
                return;
            }
            console.log("Weather Data of City \t", cityName, "\t \t \t", body);
            body = JSON.parse(body);

            if (body.code === 200) {
                //* Insert into database*/
                const weatherItem = new Weather({
                    coord: body.coord,
                    temperature: body.main,
                    city_name: body.name,
                });
                await weatherItem.save(function(err, document) {
                    if (err) {
                        console.log("Error \n", err);
                        res.status(500).send({
                            code: 500,
                            content: null,
                            message: "Internal Server Error",
                            error: err,
                        });
                        return;
                    }
                    console.log("Document Added Successfully \n", document);
                    return res.status(200).send({
                        code: 200,
                        content: body,
                        message: "Successfully Added Weather Data",
                        error: null,
                    });
                });
            } else {
                res.status(404).send({
                    code: 404,
                    content: body.message,
                    message: "Error while reteriving weather data",
                    error: null,
                });
            }
        });
    } else {
        res.status(200).send({
            code: 200,
            content: "Date is not prime no date",
            message: "Date is not prime",
            error: null,
        });
    }
});

app.listen(process.env.PORT || 3005, () => {
    console.log("started web process at Port 3005");
});

async function isPrime(number) {
    if (number <= 1) {
        return false;
    }
    for (var i = 2; i < number; i++)
        if (number % i === 0) return false;

    return true;
}