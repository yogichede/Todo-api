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
  var body = _.pick(req.body, 'description', 'completed');
  var attributeData = {};
  var todoId = parseInt(req.params.id, 10);
  var matchedRecord = _.findWhere(todos, {
    id: todoId
  });

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    attributeData.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    attributeData.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    res.status(400).send();
  }
  _.extend(matchedRecord, attributeData);
  res.json(matchedRecord);
})

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express Listening on port ' + PORT + '!');
  });
});
