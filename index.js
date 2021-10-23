const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const baseurl = 'https://forums.alliedmods.net/'
const thread = 'showthread.php'

const ignore_threads = [ 'thread_title_7999', 'thread_title_168157', 'thread_title_123555', 'thread_title_71269', 'thread_title_709' ]

app.get('/', (req, res) => {
    res.json('AlliedMods Scraped API')
})

app.get('/suggestions', (req, res) => {
    axios.get('https://forums.alliedmods.net/forumdisplay.php?f=12')
        .then(response =>{
            const html = response.data
            const $ = cheerio.load(html)
            const topics = []
            $('div > div > div > form > table > tbody > tr > td > div > a', html)
                .each(function () {
                const title = $(this).text()
                let url = baseurl + $(this).attr('href')
                const id = $(this).attr('id')
                
                if (id && !ignore_threads.includes(id)){
                    topics.push({
                        title,
                        url
                    })
                }
            })
            res.json(topics)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))