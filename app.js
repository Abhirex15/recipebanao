var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express(),
    client = new pg.Client()
    ;


// DB connect
//var connect = "postgres://rex:rex15ac15@localhost/recipebook.db"

const config = {
    user: 'rextest',
    database: 'recipebookdb',
    password: 'rex15ac15',
    port: process.env.PORT || 5432
};
var pool =new pg.Pool(config);
//Asign Dust engine to .dust files
app.engine('dust',cons.dust);

//Set default Ext .dust
 app.set('view engine','dust');
 app.set('views', __dirname + '/views');

 //set public folder
 app.use(express.static(path.join(__dirname, 'public'
)));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //{extended:false}



//Route
app.get('/',function(req, res, next) {
  //connectionString PG
   pool.connect(function(err, client, done){
      if(err){
        console.log("not able to get connection "+ err);
      }
      client.query('SELECT * FROM recipes',function(err,result){
        done();
        if(err){
          //return console.error('error running query',err);
          console.log(err);
               res.status(400).send(err);
        }
        res.render('index',{recipes: result.rows});
        //res.status(200).send(result.rows);
      });
    });

});

app.post('/add',function(req, res){
  pool.connect(function(err, client, done){
     if(err){
       console.log("not able to get connection "+ err);
     }
    client.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)',[req.body.name, req.body.ingredients, req.body.directions]);//It will basically replace those placeholders.

    done();
    res.redirect('/');
   });
});

app.delete('/delete/:id',function(req, res){
  pool.connect(function(err, client, done){
     if(err){
       console.log("not able to get connection "+ err);
     }
    client.query("DELETE FROM recipes WHERE id = $1",[req.params.id]);//It will basically replace those placeholders.

    done();
    res.send(200);
   });
});



app.post('/edit',function(req, res){
  pool.connect(function(err, client, done){
     if(err){
       console.log("not able to get connection "+ err);
     }
    client.query('UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4',[req.body.name, req.body.ingredients, req.body.directions, req.body.id]);//It will basically replace those placeholders.

    done();
    res.redirect('/');
   });
});

//Server
app.listen(3000,function(){
    console.log('Server Started On Port 3000');
});
