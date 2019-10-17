import 'babel-polyfill';
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';

import kojiLeaderboardApi from 'koji-leaderboard-api' // The library you are using

const app = express() // This is the Express App Instance
app.options('*', cors())
// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: true,
}))

/**
 * @name kojiLeaderboardApi
 * @description Doing `kojiLeaderboardApi(app)` activates the `/leaderboard` GET and POST API endpoints
 *              that your frontend can use to Display and Update Leaderboard
 * 
 * @param {Express App Instance} app - (required)
 * @param {String} tableName - (optional) Default: `leaderboard`
 */
kojiLeaderboardApi(app)

// Listen on Port 8080. Visnpmit http://localhost:8080 to see the backend.
app.listen(process.env.PORT || 3333, null, async err => {
    if (err) console.log(err.message)
    console.log('[koji] Backend Started 👏')
})