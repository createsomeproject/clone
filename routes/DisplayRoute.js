const express = require('express')
const Router = express.Router()

Router.get('/welcome', async (request,response) => {
    try {
        response.render('welcome')
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message : 'There seems to be an error getting this page'
        })
    }
})


module.exports = Router