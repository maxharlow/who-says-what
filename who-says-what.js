const Highland = require('highland')
const Request = require('request')
const CSVWriter = require('csv-write-stream')
const FS = require('fs')
const Config = require('./config')

function queryTwitterTimeline(username) {
    return {
        screen_name: username,
        count: 200
    }
}

function createTwitterTimeline(parser) {
    return function query(qs, callback) {
        const sleep = 12 * 1000 // 12 seconds
        const params = {
            url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
            qs: qs,
            oauth: {
                consumer_key: Config.twitter.consumerKey,
                consumer_secret: Config.twitter.consumerSecret,
                token: Config.twitter.accessTokenKey,
                token_secret: Config.twitter.accessTokenSecret
            }
        }
        Request.get(params, (e, response) => {
            if (e || response === undefined || response.statusCode !== 200) {
                console.log('Error! Sleeping before retrying...')
                setTimeout(() => query(qs, callback), sleep)
                return
            }
            const body = JSON.parse(response.body)
            const data = parser(qs, body)
            if (body.length > 1) setTimeout(() => {
                qs.max_id = body[body.length - 1].id_str
                query(qs, (_, dataNext) => callback(null, data.concat(dataNext.slice(1))))
            }, sleep)
            else callback(null, data)
        })
    }
}

const doTwitterTimeline = createTwitterTimeline((qs, response) => {
    return response.map(tweet => {
        return {
            url: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
            text: tweet.text,
            date: tweet.created_at,
            timesRetweeted: tweet.retweet_count,
            timesFavourited: tweet.favorite_count
        }
    })
})

Highland([Config.username])
    .map(queryTwitterTimeline)
    .flatMap(Highland.wrapCallback(doTwitterTimeline))
    .flatten()
    .pipe(CSVWriter())
    .pipe(FS.createWriteStream('results.csv'))
