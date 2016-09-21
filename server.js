var express = require('express');
var bodyParser = require('body-parser')
var _          = require('underscore');
var app = express();
var todos = [];
var todosId = 1;

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/',function(req,res){
  res.send('TODO API ROOT')
});

 //GET Request
app.get('/todos',function(req,res){
  res.json(todos);
})

//GET Request
app.get('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedRecord = _.findWhere(todos,{id:todoId});
    if(matchedRecord){
      res.json(matchedRecord);
    }
    else{
      res.status(400).send()
    }
});

//PORT Request
app.post('/todos',function(req,res){
  var body = req.body;
  if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length===0){
    return res.status(400).send();
  }

  body.id = todosId++;
  todos.push(body);
  res.json(body);
});

app.listen(PORT,function(){
  console.log('Express Listening on port ' + PORT + '!');
});
