var express = require('express');
var app = express();

var todos = [{
  id :1,
  description: 'Initial Value',
  completed : false,
},
{
id :2,
description: 'Second Value',
completed : false,
},
{
id :3,
description: 'Third Value',
completed : false,
},
{
id :4,
description: 'fourth Value',
completed : false,
}]


var PORT = process.env.PORT || 3000;

app.get('/',function(req,res){
  res.send('TODO API ROOT')
});

app.get('/todos',function(req,res){
  res.json(todos)
})

app.get('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedRecord;
    todos.forEach(function(key){
      if(todoId === key.id){
        matchedRecord=key;
      }
    });
    if(matchedRecord){
      res.json(matchedRecord);
    }
    else{
      res.status(400).send()
    }
    //res.send('Asking for todo with id of ' + req.params.id);
});

app.listen(PORT,function(){
  console.log('Express Listening on port ' + PORT + '!');
});
