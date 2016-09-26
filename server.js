var express = require('express');
var bodyParser = require('body-parser')
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var todos = [];
var todosId = 1;

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('TODO API ROOT')
});

//GET /todo?completed=false&q=work
app.get('/todos', function(req, res) {
  var queryParam = req.query;
  var where = {};
  if (queryParam.hasOwnProperty('completed') && queryParam.completed === 'true') {
    where.completed = true;
  } else if (queryParam.hasOwnProperty('completed') && queryParam.completed === 'false') {
    where.completed = false;
  }
  if (queryParam.hasOwnProperty('q') && queryParam.q.length > 0) {
    where.description = {
      $like: '%' + queryParam.q + '%'
    }
  }
  db.todo.findAll({
    where: where
  }).then(function(respData) {
    res.json(respData);
  }).catch(function(e) {
    console.log(e);
  })
})

//GET Request
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  db.todo.findById(todoId).then(function(responce) {
    if (!!responce) {
      res.json(responce.toJSON());
    } else {
      res.send(404).send();
    }
  }, function(e) {
    res.send(500).send();
  });
});

//PORT Request
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
  }, function(e) {
    console.log(e);
  });
});

//DELETE todos based on the id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function(responce) {
    if (responce === 0) {
      res.status(400).json({
        error: "No todo present with this Id"
      })
    } else {
      res.status(204).send();
    }
  }, function(e) {
    res.status(500).send();
  });
});

// PUT /todo/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var attributeData = {};

  if (body.hasOwnProperty('completed')) {
    attributeData.completed = body.completed;
  }
  if (body.hasOwnProperty('description')) {
    attributeData.description = body.description;
  }

  db.todo.findById(todoId).then(function(data) {
    if (data) {
      data.update(attributeData).then(function(todos) {
        res.json(todos.toJSON());
      }, function(e) {
        res.status(400).json(e);
      });
    } else {
      res.status(404).send();
    }
  }, function() {
    res.status(500).send();
  })
});

// POST /user
app.post('/user',function(req,res){
  var body = _.pick(req.body,'email','password');
  db.user.create(body).then(function(userData){
    res.json(userData.toJSON());
  },function(e){
    res.status(400).json(e);
  });
})

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express Listening on port ' + PORT + '!');
  });
});
