const express = require("express");
const axios = require('axios');
const cors = require("cors")

const app = express();
const port = process.env.PORT || 3000;

function share(key: string, content: string){
    let data = JSON.stringify({
        "content": content,
        "commentPermission": "everyone"
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.hackmd.io/v1/notes',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': key,
            'Cookie': 'locale=dev'
        },
        data: data
    };
    return axios.request(config);
}

function share0(req, res) {
    const {authorization} = req.headers;
    const key = authorization
    const { content } = req.body;

    // console.log(req.headers)
    // console.log(key, content)

    share(key, content)
        .then((response) => {
            const r = JSON.stringify(response.data)
            console.log(r);
            res.status(200).json({ message: "successfully", link: response.data.publishLink });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        });
}

//------------------------------------------------------------------------

app.use(cors());
// 允許來自 Obsidian 的跨域請求
// app.use(cors({origin: 'app://obsidian.md'}));

app.use(express.json());

app.get('/', (req, res) => res.send("HI"));

app.post('/share', share0);

module.exports = app;