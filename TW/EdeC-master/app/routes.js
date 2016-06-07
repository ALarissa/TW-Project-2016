process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var mysql     = require('mysql');
var bcrypt    = require('bcrypt-nodejs');

var connection = mysql.createConnection({
  host     : 'localhost',
  database : 'edec',
  user     : 'root'
});

connection.connect();

var commentLimit = []; commentLimit[0] = 0, globalIdProduct = 0;

module.exports = function(app) {

  app.get('/api/homepage', function(req, res) {
    var response = {
      randomProducts: '',
      username: 0
    }
    var getRandomProductsQuery = 'SELECT id_product, name, description, image FROM product ORDER BY price LIMIT 4';
    connection.query(getRandomProductsQuery, function(err, rows, fields) {
      if (err) throw err;
      response.randomProducts = rows;

      if (req.session.username) {
        response.username = req.session.username;
      }

      res.json(response);
    });
  });

  app.get('/api/products/:pager', function(req, res) {
    var limitUpperProduct = req.params.pager;
    var limitLowerProduct = req.params.pager - 1;
    var queryStringProducts = 'SELECT id_product, name, description, rating, image FROM product WHERE id_product BETWEEN 12*?+1 AND 12*?';
    connection.query (queryStringProducts, [limitLowerProduct, limitUpperProduct], function(err, rows, fields) {
         if (err) throw err;
         res.json(rows);
    });        
  });

  app.get('/api/product/:idProduct/comments/:pager', function(req, res) {
    var response = {
      productData: '',
      productComments: ''
    };

    if (req.params.idProduct != globalIdProduct) {
      commentLimit = []; commentLimit[0] = 0;
      globalIdProduct = req.params.idProduct;
    }

    var queryStringProduct = 'SELECT * FROM product WHERE id_product=?';
    var queryStringComments = 'SELECT u.username, DATE_FORMAT(c.postDate,"%d-%m-%Y") AS postDate, c.rating, c.comm, c.id_comm FROM comments c JOIN users u ON c.id_user=u.id_users WHERE c.id_comm > ? AND c.id_product=' + req.params.idProduct +  ' ORDER BY c.id_comm DESC LIMIT 12';

    connection.query(queryStringProduct, [req.params.idProduct], function(err, rows, fields) {
        if (err) throw err;
        response.productData = rows;
        connection.query(queryStringComments, [commentLimit[req.params.pager-1]], function(err, rows, fields) {
          if (err) throw err;
          if (rows.length <= 0) {
            res.redirect('/product/' + req.params.idProduct + '/comments/' + req.params.pager-1);
          } else {
            response.productComments = rows;
            if (req.params.pager >= commentLimit.length) commentLimit.push(rows[rows.length-1].id_comm);
            res.json(response);
          }
        });   
    });        
  });

  app.get('/api/product/:idProduct', function(req, res) {
   
    var queryStringProduct = 'SELECT * FROM product WHERE id_product=?';
    var queryStringComments = 'SELECT u.username, DATE_FORMAT(c.postDate,"%d-%m-%Y") AS postDate, c.comm, c.rating  FROM comments c JOIN users u ON c.id_user=u.id_users WHERE c.id_product=' + req.params.idProduct + ' ORDER BY  c.id_comm DESC LIMIT 4 ';

    var response = {
      productData: '',
      productComments: ''
    };

    connection.query (queryStringProduct, [req.params.idProduct], function(err, rows, fields) {
        if (err) throw err;
        
        response.productData = rows;
        connection.query (queryStringComments, function(err, rows, fields) {
        if (err) throw err;
         response.productComments = rows;
         res.json(response);
        });   
    });        
  }); 

  app.post('/api/product/:idProduct', function(req, res) {
    var id;
    var queryStringFindIdUser = 'SELECT id_users as idFound FROM users WHERE username = ?';
    var queryStringInsertComment = 'INSERT INTO comments SET ?';
    var queryStringGetRating = 'SELECT totalRating AS tr,totalVoters AS tv FROM product WHERE id_product = ?';
    var queryStringUpdateRating = 'UPDATE product SET totalRating = ?, totalVoters = ? WHERE id_product = ?';
  
    connection.query (queryStringFindIdUser, [req.session.username], function(err, rows, fields) {
      if (err) throw err;
      if(rows.length<=0)
         res.redirect('/login');
      else
      {
        var date = new Date();

        var temp = {
          id_user : rows[0].idFound,
          id_product : req.body.productId,
          postDate : date,
          comm : req.body.commentForm,
          rating : req.body.ratingForm
        };

        connection.query (queryStringInsertComment, temp, function(err, rows, fields) {
            if (err) throw err;

            connection.query (queryStringGetRating,[req.params.idProduct] , function(err, rows, fields) {
              if (err) throw err;
              var rating = parseInt(rows[0].tr ) + parseInt(temp.rating);
              var increment = rows[0].tv + 1;

                connection.query (queryStringUpdateRating,[rating,increment ,req.params.idProduct] , function(err, rows, fields) {
                if (err) throw err;
               }); 
           }); 
            res.redirect('/product/' + req.body.productId);
        }); 
      }
    });
  });


app.get('/api/friendProfile/:idUser', function(req, res) {
  var queryStringFindGoodComm = 'SELECT c.id_comm, c.id_product, c.postDate, c.comm, c.rating, p.name FROM comments c JOIN users u ON c.id_user=u.id_users JOIN product p ON c.id_product=p.id_product WHERE c.rating >= 3 AND u.id_users = ? order by c.id_comm DESC limit 5';
  var queryStringFindBadComm = 'SELECT c.id_comm, c.id_product, c.postDate, c.comm, c.rating, p.name FROM comments c JOIN users u ON c.id_user=u.id_users JOIN product p ON c.id_product=p.id_product WHERE c.rating < 3 AND u.id_users = ? order by c.id_comm DESC limit 5';
  var queryStringUser = 'SELECT id_users, username, mail, name, lastname, gender, DATE_FORMAT(birthday,"%d/%m/%Y") AS birthday, address FROM users WHERE id_users = ?';
  var queryStringFindFriends = 'SELECT f.id_friend,f.username FROM friends f, users u WHERE f.id_user= u.id_users and u.id_users = ? ';
   
  var response = {
      GoodCommData : '',
      BadCommData : '' ,
      FriendData : '' ,
      ListFriends : '' 
  };

  connection.query (queryStringUser, [req.params.idUser], function(err, rows, fields) {
    if (err) throw err;
    response.FriendData = rows ;
      
    connection.query(queryStringFindGoodComm , [req.params.idUser] , function(err,rows){
      if(err) throw err;
      response.GoodCommData = rows;   
      
      connection.query(queryStringFindBadComm , [req.params.idUser] , function(err,rows){
        if(err) throw err; 
        response.BadCommData = rows;
        
        connection.query (queryStringFindFriends , [req.params.idUser] , function(err, rows, fields) {
          if (err) throw err;
          response.ListFriends = rows;
            res.json(response);
        });
      });
    });
  });
});
 
  app.get('/api/profile', function(req, res) {
    var response = {
      UserData : '',
      FriendData : ''
    };
 
    var id =3;
    var queryStringUser = 'SELECT id_users as idUser, username, mail, name, lastname, gender, DATE_FORMAT(birthday,"%d/%m/%Y") AS birthday, address FROM users WHERE username = ?';
    var queryStringFindFriends = 'SELECT f.id_friend,f.username FROM friends f, users u WHERE f.id_user= u.id_users and u.id_users = ? ';
   
    connection.query (queryStringUser, [req.session.username], function(err, rows, fields) {
      if (err) throw err;
      response.UserData = rows;
      connection.query (queryStringFindFriends,[rows[0].idUser] , function(err, rows, fields) {
        if (err) throw err;
        response.FriendData = rows;
        res.json(response);
      });
    });
  }); 
  
  app.post('/api/register', function(req, res) {
    var ok=1;
    var queryStringUsername = 'SELECT Count(username) AS userNumber FROM users WHERE username = ? ';
    var queryStringMail = 'SELECT Count(mail) AS mailNumber FROM users WHERE mail = ? ';
    var queryStringInsert = 'INSERT INTO users SET ?';
    var temp = {
        username : req.body.username ,
        password : bcrypt.hashSync(req.body.password),
        question : req.body.security_question , 
        answer   : req.body.security_answer ,
        mail     : req.body.mail ,
        name     : req.body.first_name ,
        lastname : req.body.last_name ,
        gender   : req.body.gender ,
        birthday : req.body.birthday ,
        address  : req.body.address
    };

    var registerErrorCode = 0;

    if (temp.username) {
       connection.query (queryStringUsername, [temp.username], function(err, rows, fields) {
        if (err) throw err;
          if(rows[0].userNumber > 0) {
                registerErrorCode = 1;
                res.redirect('/register?error=' + registerErrorCode);
          } else {
            connection.query (queryStringMail, [temp.mail], function(err, rows, fields) {
              if (err) throw err;

              if(rows[0].mailNumber > 0) {
                  registerErrorCode = 2;
                  res.redirect('/register?error=' + registerErrorCode);
              } else {
                connection.query ('INSERT INTO users SET ?', temp, function(err, rows, fields) {
                  if (err) throw err;
                  res.redirect('/register?error=' + registerErrorCode);
                });
              }
            });
          }
          
      });
    }
  });

  app.get('/api/statistics', function(req, res) {
    var queryStringProductStatistics = 'SELECT totalSales, price, name FROM product';
    var queryStringStarStatistics = 'SELECT ' + 
    '(SELECT count(total_1) FROM product WHERE total_1 != 0) AS total1,' +
    '(SELECT count(total_2) FROM product WHERE total_2 != 0) AS total2,' +
    '(SELECT count(total_3) FROM product WHERE total_3 != 0) AS total3,' +
    '(SELECT count(total_4) FROM product WHERE total_4 != 0) AS total4,' +
    '(SELECT count(total_5) FROM product WHERE total_5 != 0) AS total5';
    var response = {
      products: '',
      stars: ''
    }

    connection.query(queryStringProductStatistics, function(err, rows) {
      if (err) throw err;
      else {
        response.products = rows;
        connection.query(queryStringStarStatistics, function(err, rows) {
          if (err) throw err;
          else {
            response.stars = rows;
            res.json(response);
          }
        });
      }
    })
  });

  app.get('/api/statistics/:pager', function(req, res) {
    var limitUpperProduct = req.params.pager;
    var limitLowerProduct = req.params.pager - 1;
    var queryStringGetStatistics = 'SELECT name, id_product, totalSales FROM product WHERE id_product BETWEEN 12*?+1 AND 12*?';
    connection.query (queryStringGetStatistics, [limitLowerProduct, limitUpperProduct], function(err, rows, fields) {
       if (err) throw err;
       res.json(rows);
    }); 
  });

  app.get('/api/statistic/:idProduct', function(req, res) {
    var response = {
      product: '',
      comments: ''
    }
    var queryStringProduct = 'SELECT * FROM product WHERE id_product = ?';
    var queryStringComments = 'SELECT u.username, c.rating, c.id_comm FROM comments c JOIN users u ON c.id_user=u.id_users WHERE c.id_product=' + req.params.idProduct +  ' ORDER BY c.id_comm ASC';
    connection.query(queryStringProduct, [req.params.idProduct], function(err, rows, fields) {
       if (err) throw err;
       response.product = rows;
       connection.query(queryStringComments, function(err, rows) {
        if (err) throw err;
        response.comments = rows;
        res.json(response);
       })
    }); 
  });

  app.post('/api/login', function(req, res) {
    var queryStringLogin = 'SELECT password FROM users WHERE username = ?';
    var loginErrorCode = 0;
    connection.query(queryStringLogin, [req.body.username], function(err, rows, fields) {
      if (err) throw err;
   
      if (rows[0] == null) {
        loginErrorCode = 1;
        res.redirect('/login?error=' + loginErrorCode);
      } else if (!bcrypt.compareSync(req.body.password, rows[0].password)) {
        loginErrorCode = 1;
        res.redirect('/login?error=' + loginErrorCode);
      } else {
        req.session.username = req.body.username;
        res.redirect('/homepage');
      }
    })
  });

  app.get('/api/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });
          
  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });
};




