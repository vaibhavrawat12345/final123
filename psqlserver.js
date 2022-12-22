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
  let product = req.query.product;
  let shop = req.query.shop;
  let sort = req.query.sort;

  const query = `SELECT * FROM purchase`;
  client.query(query , function (err, result) {
    if (err) {
        res.status(400).send(err);
    }
     else  {
           let arr1 = result.rows

          if (product) {
            let pro = product.split(",");
            arr1 = arr1.filter((st) => pro.find((c1) => c1 === st.productname));
          }
          if (shop) {
            let shop1 = shop.split(",");
            arr1 = arr1.filter((st) => shop1.find((c1) => c1 * 1 === st.shopid));
          }
          if (sort === "QtyAsc") arr1.sort((st1, st2) => st1.quantity - st2.quantity);
          if (sort === "QtyDesc") arr1.sort((st1, st2) => st2.quantity - st1.quantity);
          if (sort === "ValueAsc")
            arr1.sort(
              (st1, st2) => st1.quantity * st1.price - st2.quantity * st2.price
            );
          if (sort === "ValueDesc")
            arr1.sort(
              (st1, st2) => st2.quantity * st2.price - st1.quantity * st1.price
            );
            res.send(arr1); 



     }
     })     
          
          
    })




    app.get("/totalpurchases/products/:id", function (req, res) {
      let productid = req.params.id; 
      const query = `select * from purchase WHERE productid= $1`;
      client.query(query ,[productid], function (err, result) {
          if (err) {
              res.status(400).send(err);
          }
          else {
            let arr1 = result.rows
          var abc = arr1.reduce(function (agg, obj) {
            var objForId = agg.filter(function (idObj) { return idObj.shopid === obj.shopid})[0]
            
            if (objForId) {
              objForId.quantity += obj.quantity;


            } else {
              agg.push({
                shopid: obj.shopid,
                quantity: obj.quantity
              })
            }
          
            return agg;
          }, [])
        
          res.send(abc)
        }
        });
    
            });
    






            app.get("/totalpurchases/shops/:id", function (req, res) {
              let shopid = req.params.id; 
              const query = `select * from purchase WHERE shopid= $1`;
              client.query(query ,[shopid], function (err, result) {
                  if (err) {
                      res.status(400).send(err);
                  }
                  else {
                    let arr1 = result.rows
                  var abc = arr1.reduce(function (agg, obj) {
                    var objForId = agg.filter(function (idObj) { return idObj.productid === obj.productid})[0]
                    
                    if (objForId) {
                      objForId.quantity += obj.quantity;
        
        
                    } else {
                      agg.push({
                        productid: obj.productid,
                        quantity: obj.quantity
                      })
                    }
                  
                    return agg;
                  }, [])
                
                  res.send(abc)
                }
                });
            
                    });
            
        
app.get("/shops", function (req, res, next) {
  const query = "SELECT * FROM shops";
  client.query(query, function (err, result) {
      if (err) { 
        res.status(400).send(err);
      }
      res.send(result.rows); 
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
  });

});  



app.get("/products", function (req, res, next) {
  const query = "SELECT * FROM products";
  client.query(query, function (err, result) {
      if (err) { 
        res.status(400).send(err);
      }
      res.send(result.rows); 
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
  const query = `INSERT INTO purchase (shopid,productId,quantity,price) VALUES ($1,$2,$3,$4)`;
  client.query(query, values, function (err, result) {if (err) {res.status(400).send(err);}
  res.send("insertion successful");
  });
});





app.put("/products/:productId", function (req, res, next) {
  console.log("Inside put of user");
  let productId = req.params.productId
  let productname = req.body.productname
  let category = req.body.category
  let description = req.body.description
  let values = [productname,category,description,productId]
  const query = `UPDATE products SET productname =$1, category= $2,description=$3 where productId=$4`;
  console.log(query)

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
  const query = `select * from purchase WHERE shopId= $1`;
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
  const query = `select * from purchase WHERE productid= $1`;
  client.query(query ,[productid], function (err, result) {
      if (err) {
          res.status(400).send(err);
      }
      res.send(result.rows); 
  });
});





