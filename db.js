var Sequelize = require('sequelize');  // it is used to manage our data js array to DB
var sequelize = new Sequelize(undefined,undefined,undefined,{
   'dialect' : 'sqlite',
   'storage' : __dirname+ '/data/dev-todo-api.sqlite'
});

var  db= {};
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
