const { Configuration, OpenAIApi } = require('openai');
const fs = require("fs");
const express = require("express");
const app = express();
const request = require("request");
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);
async function aiImage(buffer, callback) {
    try {
        const response = await openai.createImageVariation(
            buffer,
            1,
            "512x512"
        );
        callback(response.data);
    } catch (error) {
        if (error.response) {
            callback(error.response.data);
        } else {
            callback(error.message);
        }
    }
}

app.get('/', (req, res) => {
    let url = req.query.url;
    if (!url) {
        res.send("err")
    } else {
        request({
                url: url,
                encoding: null
            },
            (err, resp, buffer) => {
                buffer.name = "image.png";
                aiImage(buffer, (response) => {
                    res.send(response)
                })
            })
    }
})
app.listen(3000, () => console.log("Listening..."))
