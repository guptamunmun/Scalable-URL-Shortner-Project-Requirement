const express =require("express")
const mongoose = require("mongoose")
const route = require('./routes/route')
// var shortUrl = require("node-url-shortener");
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:false}))

mongoose.connect("mongodb+srv://priyanka99:EorbzmKpqdV7ml9W@cluster0.puozp1a.mongodb.net/Group56Database?retryWrites=true&w=majority",{
useNewUrlParser:true})

.then(()=> console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.use('/', route)
// url shortener


// shortUrl.short("https://github.com/sabihak89/plutonium/tree/project/url_shortner#url-shorten-response", function (err, url) {
//     console.log(url);
// });


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})