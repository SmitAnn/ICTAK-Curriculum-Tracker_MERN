const express = require('express');
var app = new express();
app.use(express.json());

const cors = require('cors');
app.use(cors({ origin: '*' }));
const mongoose = require('mongoose');
const requirement = require('./routes/requirementData');
const user = require("./routes/userData");
const curriculum = require('./routes/curriculumData');
mongoose.set("strictQuery", false);

const path = require('path');

mongoose.connect
    ('mongodb+srv://Curriculum:tracker@cluster0.wagyxn7.mongodb.net/CurriculumTrackerDB?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });


app.use('/api/api/requirement', requirement);
app.use("/api/user", user);
app.use('/api/api/curriculum', curriculum);

app.use(express.static(path.join(__dirname, '/build')));
app.get(`/*`, function (req, res) { res.sendFile(path.join(__dirname, '/build/index.html')); });

//Running server at port 5000

app.listen(5000, () => {
    console.log("Server listening to port 5000");
})