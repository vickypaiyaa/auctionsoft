var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({resave: true, saveUninitialized: true, secret: 'auctionSoft123', cookie: { maxAge: 60000 }}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));
app.use(express.static("node_modules/jquery-paginate"));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', login);
app.use('/users', users);

var config      = require('./knex.js');
var env         = 'development';
var knex        = require('knex')(config[env]);

var Users = [];

app.get('/protected_page', checkSignIn, function(req, res){
  res.render('protected_page', {id: req.session.user.id})
});

app.get('/login', function(req, res){
  console.log('login page');
  res.render('login');
});

app.post('/login', async function(req, res){
  console.log(req.body);
  if(!req.body.username || !req.body.password){
     res.render('login', {message: "Incorrect Username or password"});
  } else {
    await knex('users').where({
      username: req.body.username,
    }).select('*').then(function(result) {
      console.log(result);
      if(result){
          result.forEach(function(user) {
            if(user.username === req.body.username && user.password === req.body.password){
              req.session.user = req.body.username;
              res.redirect('/');
              //knex.destroy();
            }
          });
     }
    });
    res.render('login', { pageTitle : 'Login'});
  }
  //knex.destroy();
});

app.get('/logout', function(req, res){
  req.session.destroy(function(){
     console.log("user logged out.")
  }); 
  res.redirect('/login');
});

app.use('/protected_page', function(err, req, res, next){
  console.log(err);
  //User should be authenticated! Redirect him to log in.
  res.redirect('/login');
});

function checkSignIn(req, res){
  if(req.session.user){
     next();     //If session exists, proceed to page
  } else {
     var err = new Error("Not logged in!");
     console.log(req.session.user);
     next(err);  //Error, trying to access unauthorized page!
  }
}

app.get('/filter/:value', function(req, res, next) {
  console.log(req.params.value + 'hiii');
  if(req.params.value == 'recent') {
    knex.raw('select * from users as a join projects as p on(p.user_id = a.user_id) left join categories as c on(c.cid = p.cid) ORDER BY p.id DESC ').then(function(values) {
      res.send(values.rows);
    });
  }
  if(req.params.value == 'category') {
    knex.raw('select * from users as a join projects as p on(p.user_id = a.user_id) left join categories as c on(c.cid = p.cid) ORDER BY c.cid ASC ').then(function(values) {
      res.send(values.rows);
    });
  }
  if(req.params.value == 'username') {
    knex.raw('select * from users as a join projects as p on(p.user_id = a.user_id) left join categories as c on(c.cid = p.cid) ORDER BY a.username ASC ').then(function(values) {
      res.send(values.rows);
    });
  }
  if(req.params.value == 'project_title') {
    knex.raw('select * from users as a join projects as p on(p.user_id = a.user_id) left join categories as c on(c.cid = p.cid) ORDER BY p.project_name ASC ').then(function(values) {
      res.send(values.rows); 
    });
  }
  //knex.destroy();
  //res.render('index', { title: 'Projects' });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
