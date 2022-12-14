const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const articles = [];

const newspapers = [
    {
        name: 'HindustanTimes',
        address: 'https://www.hindustantimes.com/ht-insight/climate-change',
        base: 'https://www.hindustantimes.com'
    },
    {
        name: 'Guardians',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: 'https://www.theguardian.com'
    },
    { 
        name: 'IndianExpress',
        address: 'https://indianexpress.com/about/explained-climate/',
        base: 'https://www.indianexpress.com'
    },
    {
        name: "Independent",
        address: 'https://www.independent.co.uk/climate-change',
        base: 'https://www.independent.co.uk'
    },
    {
        name: "cnn",
        address: "https://edition.cnn.com/specials/world/cnn-climate",
        base: "https://edition.cnn.com/"
    },
    {
        name: "TheSun",
        address: "https://www.thesun.co.uk/topic/climate-change-environment/",
        base: "https://www.thesun.co.uk"
    },
    {
        name: "cnbc",
        address: "https://www.cnbc.com/climate/",
        base: "https://www.cnbc.com"
    },
    {
        name: "skynews",
        address: "https://globalnews.ca/tag/climate-change/",
        base: "https://globalnews.ca"
    }
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title,
                url: newspaper.base + url, 
                source: newspaper.name
            })
        })
    })
    .catch(err => {console.log(err)});
})

app.listen(PORT, () => console.log(`server running at PORT ${PORT}`));

app.get("/", (req, res) => {
    res.json("Welcome to Climate Change Home page")
});

app.get("/news", (req, res) => {
    res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
    const newspaperId = req.params.newspaperId;
    const newspaperAdd = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base; 

    axios.get(newspaperAdd)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificArticles = [];

        $(`a:contains("climate")`, html).each(function () { 
            const title = $(this).text();
            const url = $(this).attr("href");
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            });
        })
        res.json(specificArticles);
    })
    .catch(err => console.log(err));
})