const env = 'development';
const config = require('./knexfile.js')[env];
const knex = require('knex')(config);
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(__dirname + '/static'));

app.set('view engine', 'ejs');


//displays all users
app.get('/users', function(req, res) {
  res.redirect('/users/page/1');
});

//pagination
app.get('/users/page/:pageNumber', function(req, res) {
  let limitPerPage = 10;
  let pageNumber = req.params.pageNumber;

  knex('users')
  .count()
  .then((recordCount) => {
    knex('users')
    .orderBy('first_name', 'asc')
    .offset((limitPerPage * pageNumber) - limitPerPage)
    .limit(limitPerPage)
    .then((result) => {
      res.render('index', {
        numberOfPages: Math.ceil(Number(recordCount[0].count)/limitPerPage),
        results: result,
        currentPage: Number(pageNumber)
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })

});


//creates a new user
app.post('/users', function(req, res) {
  knex('users')
  .insert(req.body, '*') //remove req.body, the user can change the input fields names at any time and consequently change the table columns that are being changed i.e.: the user can change input name from "user.age" to "user.id" causing this post request to create a user with no age, but with an id that has a chance of being duplicated
  .then((newUser) => {
    console.log(newUser);
    res.redirect('/users');
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

//displays specific user's profile and their posts
app.get('/users/:id', function(req, res) {
  // knex('users')
  // .where('id', req.params.id)
  // .then((user) => {
  //   knex('posts')
  //   .where('user_id', req.params.id)
  //   .orderBy('id', 'desc')
  //   .then((posts) => {
  //     res.render('userProfile', {
  //       user: user[0],
  //       posts: posts
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.sendStatus(400);
  //   });
  // })
  // .catch((err) => {
  //   console.log(err);
  //   res.sendStatus(400);
  // })


  knex('users')
  .where('id', req.params.id)
  .then((user) => {
    knex('posts')
    .where('user_id', req.params.id)
    .orderBy('id', 'desc')
    .then((posts) => {
      knex('comments')
      .join('posts', 'posts.id', 'comment_post_id')
      .then((comments) => {
        res.render('userProfile', {
          user: user[0],
          posts: posts,
          comments: comments
        });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      })
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })


  // I don't like the data this returns... Array of objects showing the same user info with different commments
  // knex.from('users')
  // .join('posts', 'posts.user_id', 'users.id')
  // .where('posts.user_id', req.params.id)
  // .then((result) => {
  //   console.log(result);
  //   res.json(result);
  // })
  // .catch((err) => {
  //   console.log(err);
  //   res.sendStatus(400);
  // })

});

//add new post to database
app.post('/users/:id/posts', function(req, res) {
  let newPost = {
    content: req.body.content,
    user_id: Number(req.params.id)
  }
  console.log(newPost);
  knex('posts')
  .insert(newPost, '*')
  .then((update) => {
    console.log("NEW POST: ", update);
    res.redirect(`/users/${req.params.id}`);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});


//add new comment
app.post('/users/:postID/comments', function(req, res) {

  console.log(req.body);

  let newComment = {
    comment_content: req.body.comment_content,
    comment_user_id: req.body.comment_user_id,
    comment_post_id: req.params.postID
  }

  knex('comments')
  .insert(newComment, '*')
  .then((update) => {
    console.log("NEW COMMENT: ", update);
    res.redirect(`/users/${req.body.user_profile_id}`)
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })

});

//edits user's information
app.get('/users/:id/edit', function(req, res) {
  knex('users')
  .where('id', req.params.id)
  .then((userInfo) => {
    res.render('userProfileEdit', userInfo[0]);
  })
});

//post changes made to user's profile
app.post('/users/:id/edit', function(req, res) {
  knex('users')
  .update(req.body, '*')
  .where('id', req.params.id)
  .then((updatedUser) => {
    res.redirect(`/users/${req.params.id}`);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

//deletes user
app.get('/users/:id/delete', function(req, res) {
  knex('users')
  .del()
  .where('id', req.params.id)
  .then((deletedUser) => {
    console.log("deleted records: ", deletedUser);
    res.redirect('/users');
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

app.listen(port, function() {
  console.log('Fala que eu te escuto:', port);
});
