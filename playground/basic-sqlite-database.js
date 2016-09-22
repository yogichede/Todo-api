var Sequelize = require('sequelize');  // it is used to manage our data js array to DB
var sequelize = new Sequelize(undefined,undefined,undefined,{
   'dialect' : 'sqlite',
   'storage' : __dirname+ '/basic-sqlite-database.sqlite'
});

var TODO = sequelize.define('todo',{
    description : {
      type : Sequelize.STRING,
      allowNull : false,
      validate : {
        len:[1,250]
      }
    },
    completed : {
      type : Sequelize.BOOLEAN,
      allowNull : false,
      defaultValue : false
    }
});

sequelize.sync({}).then(function(){
  console.log('Everything is synced');
   TODO.findById(3).then(function(data){
     if(data){
       console.log(data.toJSON());
     }
     else {
       console.log('No Data Present');
     }
  });
  // TODO.create({
  //   description :'This is Me',
  //   completed   : false
  // }).then(function(todo){
  //     console.log('finished');
  //     console.log(todo);
  // }).then(function(todo){
  //   return TODO.create({
  //     description : 'This is Done'
  //    });
  //   }).then(function(){
  //     // return TODO.findById(1);
  //     return TODO.findAll({
  //       where : {
  //         description : {
  //         $like : '%Me%'
  //       }
  //     }
  //     });
  //   }).then(function(todos){
  //     if(todos){
  //     todos.forEach(function(val){
  //       console.log(val.toJSON());
  //     })
  //     }
  //     else {
  //       console.log('No ID Present');
  //     }
  //   }).catch(function(e){
  //   console.log(e);
  // });
});
