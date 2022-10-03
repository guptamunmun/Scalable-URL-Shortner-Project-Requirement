const express = require('express')
const mongoose = require('mongoose')
const app = express()
const route = require('./Routes/routes');


app.use(express.json())

app.use(express.urlencoded({ extended: true }))


mongoose.connect("mongodb+srv://priyanka99:EorbzmKpqdV7ml9W@cluster0.puozp1a.mongodb.net/Group56Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})

    .then(() => console.log("MongoDB is Connected..."))
    .catch((err) => console.log(err.message))
    
app.use('/', route);


app.listen(3000, function () {
    console.log('Express app running on port ' +(3000))
});