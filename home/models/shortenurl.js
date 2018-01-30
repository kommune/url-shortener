const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema ({
    longURL: { type: String, required: true },
    shortURL: String
})

const Shorten = mongoose.model('Shorten', urlSchema)

module.exports = Shorten