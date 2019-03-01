const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.port || 3000;

var app = express();

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear()); //function template not to repeat in renderings
hbs.registerHelper('screamIt', (text) => text.toUpperCase());
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.engine('hbs', require('hbs').__express);



//middleware with NEXT function without which APP doesnt move on eny request, so it must be called. Try without NEXT for proof
app.use((req,res,next) =>{
    let now = new Date().toString();
    let log = `${now}: ${req.method}: ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) =>{
        if(err){console.log('Unable to append')}
    })

    next();
});

//middleware without NEXT, so it will stop everything
// app.use((req,res,next) => {
//     res.render('maintenance.hbs');
    
// });

//Middleware for static pages. Ex: localhost:3000/help.html
app.use(express.static(__dirname + '/public'));

//Simple initial response
app.get('/', (req,res) => res.render('home.hbs',{
    pageTitle:'Home Page',
    head:'This is Home Page'
}));

app.get('/help', (req,res) => res.render('help'))

// rendering hbs mustache templage page
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        head:'This is About Page'
    });
});
app.listen(port, () => console.log('Running on port - ', port));