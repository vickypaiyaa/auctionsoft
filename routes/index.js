var express = require('express');
var router = express.Router();

var config      = require('../knex.js');
var env         = 'development';
var knex        = require('knex')(config[env]);

/* GET home page. */
router.get('/', function(req, res, next) {
  knex.raw('select * from users as a join projects as p on(p.user_id = a.user_id) left join categories as c on(c.cid = p.cid) ').then(function(values) {
    console.log(values.rows);
    res.render('index', { title: 'Projects', rows: values.rows });
    //knex.destroy();
  });
  //res.render('index', { title: 'Projects' });
});

module.exports = router;
