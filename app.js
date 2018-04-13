const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('DB connected'))
.catch(err => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas')

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/about', (req,res) => {
    res.render('about');
});

app.get('/ideas/add',(req,res) =>{
    res.render('ideas/add');
})

app.post('/ideas',(req,res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please fill out title input'});
    }
    if(!req.body.details){
        errors.push({text:'Please fill out details input'});
    }

    if(errors.length > 0){
        res.render('ideas/add',{
            errors,
            title:req.body.title,
            detail:req.body.details
        });
    }
    else{
        const newUser ={
            title: req.body.title,
            details: req.body.details,
        }

        new Idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas')
        });
    }

});

const port = 5000;

app.listen(port,() => {
    console.log(`Server started on port ${port}`)
});