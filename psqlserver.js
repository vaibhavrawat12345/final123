let express = require("express");

var cors = require("cors");
let app = express();
app.use(cors());

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested=With,X-Auth-Token, Content-Type, Accept"
  );
  next();
});

const { Client } = require("pg");
const client = new Client({
    host: "db.ytrntvnptnchnczztvqu.supabase.co",
    user: "postgres",
    password: "Vaibhavrawat@123",
    database: "postgres",
    port: 5432,
    ssl: { rejectUnauthorized: false },
});

var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));


client.connect(function (err, result) {
   console.log(`Connected!!!`,client.port)
})


app.get("/purchases",function(req,res){
  let productid = req.query.productid;
  let shopId = req.query.shopId;
  let sort = req.query.sort;
  let abc=''



  const query = `SELECT * FROM purchases`;
  client.query(query , function (err, result) {
    if (err) {
        res.status(400).send(err);
    }
    else {

      


         

            if (shopId && productid && sort ) {
              if (sort==='qtyAsc'){
                sort = "order by quantity asc"
              }
              else   if (sort==='qtyDesc'){
                sort = "order by quantity desc"
              }
              else   if (sort==='valAsc'){
                sort = "order by quantity*price asc"
              }
              else   if (sort==='valDesc'){
                sort = "order by quantity*price desc"
              }
              abc=sort
            
            
                const query = `SELECT * FROM purchases where shopId=$1 and productid=$2 $3 `;
                client.query(query ,[shopId,productid,abc], function (err, result1) {
                    if (err) {
                        res.status(400).send(err);

                    }
                    res.send(result1.rows); 
                });

             }
            else if (shopId && productid  ) {
             
                const query = `SELECT * FROM purchases where shopId=$1 and productid=$2  `;
                client.query(query ,[shopId,productid], function (err, result1) {
                    if (err) {
                        res.status(400).send(err);

                    }
                    res.send(result1.rows); 
                });

             }

             else if (productid&&sort) {
              if (sort==='qtyAsc'){
                sort = "order by quantity asc"
              }
              else   if (sort==='qtyDesc'){
                sort = "order by quantity desc"
              }
              else   if (sort==='valAsc'){
                sort = "order by quantity*price asc"
              }
              else   if (sort==='valDesc'){
                sort = "order by quantity*price desc"
              }
            abc=sort
            
                const query = `SELECT * FROM purchases where productid=$1 $2`;
                client.query(query ,[productid,abc], function (err, result1) {
                    if (err) {
                        res.status(400).send(err);
                    }
                    res.send(result1.rows); 
                });
  
             }
             else if (productid) {
              
            
                const query = `SELECT * FROM purchases where productid=$1 `;
                client.query(query ,[productid], function (err, result1) {
                    if (err) {
                        res.status(400).send(err);
                    }
                    res.send(result1.rows); 
                });
  
             }



              else if (shopId&&sort) {
                if (sort==='qtyAsc'){
                  sort = "order by quantity asc"
                }
                else   if (sort==='qtyDesc'){
                  sort = "order by quantity desc"
                }
                else   if (sort==='valAsc'){
                  sort = "order by quantity*price asc"
                }
                else   if (sort==='valDesc'){
                  sort = "order by quantity*price desc"
                }
              
              abc=sort
              

              const query = `SELECT * FROM purchases where shopId=$1 $2`;
              client.query(query ,[shopId,abc], function (err, result1) {
                  if (err) {
                      res.status(400).send(err);
                  }
                  res.send(result1.rows); 
              });
              
            

             }

             else if (shopId) {
             
            

            const query = `SELECT * FROM purchases where shopId=$1 `;
            client.query(query ,[shopId], function (err, result1) {
                if (err) {
                    res.status(400).send(err);
                }
                res.send(result1.rows); 
            });
            
          

           }

             else if (sort==='qtyAsc') {
              

              const query = `SELECT * FROM purchases order by quantity asc`;
              client.query(query , function (err, result2) {
                  if (err) {
                      res.status(400).send(err);
                  }
                  res.send(result2.rows); 
              });
              
            

             }
             else if (sort==='qtyDesc') {
              

              const query = `SELECT * FROM purchases order by quantity desc`;
              client.query(query , function (err, result1) {
                  if (err) {
                      res.status(400).send(err);
                  }
                  res.send(result1.rows); 
              });
              
            

             }
             else if (sort==='valAsc') {
              

              const query = `SELECT * FROM purchases order by quantity*price asc`;
              client.query(query , function (err, result1) {
                  if (err) {
                      res.status(400).send(err);
                  }
                  res.send(result1.rows); 
              });
              
            

             } 
             else if (sort==='valDesc') {
              

              const query = `SELECT * FROM purchases order by quantity*price desc`;
              client.query(query , function (err, result1) {
                  if (err) {
                      res.status(400).send(err);
                  }
                  res.send(result1.rows); 
              });
              
            

             }


             else  res.send(result.rows); 

      }
  })
})

app.get("/shops", function (req, res, next) {
  const query = "SELECT * FROM shops";
  client.query(query, function (err, result) {
      if (err) { 
        res.status(400).send(err);
      }
      res.send(result.rows); 
      client.end();
  });

});


app.get("/products/:id", function (req, res, next) {
  let productid = req.params.id
  let values = [productid]


  const query = "select * from products where productid=$1";
  client.query(query,values, function (err, result) {
      if (err) { 
        res.status(400).send(err);
      }
      res.send(result.rows); 
      client.end();
  });

});  



app.get("/products", function (req, res, next) {
  const query = "SELECT * FROM products";
  client.query(query, function (err, result) {
      if (err) { 
        res.status(400).send(err);
      }
      res.send(result.rows); 
      client.end();
  });

});


app.post("/shops", function (req, res, next) {
  var values = Object.values(req.body);console.log(values);
  const query = `INSERT INTO shops (name,rent) VALUES ($1,$2)`;
  client.query(query, values, function (err, result) {if (err) {res.status(400).send(err);}
  res.send("insertion successful");
  });
});


app.post("/products", function (req, res, next) {
  var values = Object.values(req.body);console.log(values);
  const query = `INSERT INTO products (productname,category,description) VALUES ($1,$2,$3)`;
  client.query(query, values, function (err, result) {if (err) {res.status(400).send(err);}
  res.send("insertion successful");
  });
});


app.post("/purchases", function (req, res, next) {
  var values = Object.values(req.body);console.log(values);
  const query = `INSERT INTO purchases (shopid,productId,quantity,price) VALUES ($1,$2,$3,$4)`;
  client.query(query, values, function (err, result) {if (err) {res.status(400).send(err);}
  res.send("insertion successful");
  });
});





app.put("/products/:productId", function (req, res, next) {
  console.log("Inside put of user");
  let productId = req.params.productId
  let category = req.body.category
  let description = req.body.description
  let values = [category,description,productId]
  const query = `UPDATE mobileapp SET category= $1,description=$2 where productId=$3`;
  client.query(query, values, function (err, result) {
      if (err) {
          res.status(400).send(err);
      }
      res.send(" updation successful");
  });
});




app.get("/purchases/shops/:shopId", function (req, res, next) {
  console.log("Inside put of user");
  let shopId = req.params.shopId;
  const query = `select * from purchases WHERE shopId= $1`;
  client.query(query ,[shopId], function (err, result) {
      if (err) {
          res.status(400).send(err);
      }
      res.send(result.rows); 
  });
});

app.get("/purchases/products/:productid", function (req, res, next) {
  console.log("Inside put of user");
  let productid = req.params.productid;
  const query = `select * from purchases WHERE productid= $1`;
  client.query(query ,[productid], function (err, result) {
      if (err) {
          res.status(400).send(err);
      }
      res.send(result.rows); 
  });
});





