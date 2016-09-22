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
  var body = _.pick(req.body,'description','completed');
  body.description = body.description.trim();
  body.id = todosId++;
  todos.push(body);
  res.json(body);
});

//DELETE todos based on the id
app.delete('/todos/:id',function(req,res){
  var todoId = parseInt(req.params.id,10);
  var deleteId = _.findWhere(todos,{id:todoId});
  if(!deleteId){
    res.status(400).json({"error" : "No Id Present with this Id"});
  }
  else {
    todos = _.without(todos,deleteId);
    res.json(deleteId);
  }
});

// PUT /todo/:id

app.put('/todos/:id',function(req,res){
  var body = _.pick(req.body,'description','completed');
  var attributeData = {};
  var todoId = parseInt(req.params.id,10);
  var matchedRecord = _.findWhere(todos,{id:todoId});

  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
    attributeData.completed = body.completed;
  }
  else if(body.hasOwnProperty('completed')){
    res.status(400).send();
  }

 if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length>0){
   attributeData.description = body.description;
 }
 else if(body.hasOwnProperty('description')){
   res.status(400).send();
 }
 _.extend(matchedRecord,attributeData);
 res.json(matchedRecord);
})

app.listen(PORT,function(){
  console.log('Express Listening on port ' + PORT + '!');
});
