const mongoose = require("mongoose")
// let nodeUrl = require("node-url-shortener");


const urlSchema = new mongoose.Schema({


    urlCode: { type: String,
         required: true, 
         unique: true,
          lowercase: true, 
          trim: true ,
        // default:nodeUrl.short
    },

    longUrl: {
        type: String,
        required: true,
         trim: true
    },
    shortUrl: { type:String,
        required: true,
         unique: true,
          trim: true,
        default: 
          "http://localhost:3000/urlCode"}
        }, { timestamps: true })


module.exports = mongoose.model('Url', urlSchema) //url