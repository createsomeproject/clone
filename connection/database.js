const mongoose = require('mongoose')
const ConnectionDb = (url) => {
    return mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true   
    })}

module.exports = ConnectionDb