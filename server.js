var express = require("express");
var cors = require("cors");
var mysql = require("mysql2/promise");

var server = express();
server.use(cors());
server.use(express.json());


var db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "Asoft"
})

server.listen(8080, async () => {
    console.log("Server is online");
    (await db).connect().then(() => {
        console.log("Connected to MySQL!");
    })
})
// ====================================  CRUD PRODUCTS ================================ //
server.get("/products", async (req, res) => {
    try
    {
        var listData = [];
        (await db).query("select * from Product").then(([result, field]) => {
            result.forEach((r) => {
                listData.push(r);
            })
            res.status(200).send(listData);
        })
    }
    catch (e)
    {
        res.status(400).send(e);
    }
})
server.get("/products/:id", async (req, res) => {
    try
    {
        (await db).query(`select * from Product where ProductID = '${req.params.id}'`).then(([result, field]) => {
            if (result[0] == null) {
                res.status(300).send({ msg: `No product ID ${req.params.id}`});
                return;
            }
            res.status(200).send(result[0]);
            return;
        })
    }
    catch (e)
    {
        console.log(e);
    }
})

server.post("/products/:id", async (req, res) => {
    try
    {
        const productId = req.params.id;
        const { productName, productPrice } = req.body;
        const dbInstance = await db;

        const [checkResult] = await dbInstance.query(
            `SELECT COUNT(*) AS count FROM product WHERE ProductID = ?`, 
            [productId]
        );
        if (checkResult[0].count > 0) {
            return res.status(301).send({ msg: `Product ID ${productId} is already in use` });
        }

        await dbInstance.query(
            `INSERT INTO product (ProductID, ProductName, Price) VALUES (?, ?, ?)`, 
            [productId, productName, productPrice]
        );
        res.status(200).send({ msg: "Insert OK" });
    }
    catch (e)
    {
        res.status(500).send({ msg: e.message });
    }
});


server.put("/products/:id", async (req, res) => {
    try
    {
        var productId = req.params.id;
        var { productName, price } = req.body;
        (await db).query(`update product set ProductName = '${productName}', Price = ${price}
                        where ProductID = '${productId}'`).then(([r, f]) => {
            res.status(200).send({ msg: "Update OK"});
        })
    }
    catch (e)
    {
        res.status(400).send(e);
    }
})

server.delete("/products/:id", async (req, res) => {
    try
    {
        console.log(1);
        (await db).query(`select COUNT(*) from InvoiceDetails where ProductID = '${req.params.id}'`)
        .then(async ([r, f]) => {
            if (r[0]['COUNT(*)'] == 0)
            {
                console.log(2);
                (await db).query(`delete from Product where ProductID = '${req.params.id}'`).then(([r, f]) => 
                {
                    console.log(r);
                    res.status(200).send({ msg: `Deleted Product ID ${req.params.id}`})
                })
            }
            else
            {
                res.status(301).send("Product is used by InvoiceDetails, cannot delete!");
            }
        })
    }
    catch (e)
    {
        res.status(400).send(e);
    }
})


//========================================  CRUD Customer  ========================================
server.get("/customers", async (req, res) => {
    try
    {
        var listData = [];
        (await db).query("select * from customer").then(([result, field]) => {
            result.forEach((r) => {
                listData.push(r);
            })
            res.status(200).send(listData);
        })
    }
    catch (e)
    {
        console.log(e);
    }
})

server.get("/customers/:id", async (req, res) => {
    try
    {
        (await db).query(`select * from Customer where CustomerID = '${req.params.id}'`).then(([result, field]) => {
            if (result[0] == null) {
                res.status(300).send({ msg: `No customer ID ${req.params.id}`});
                return;
            }
            res.status(200).send(result[0]);
            return;
        })
    }
    catch (e)
    {
        console.log(e);
    }
})

server.post("/customers/:id", async (req, res) => {
    try
    {
        const customerID = req.params.id;
        const { customerName, customerPhone } = req.body;
        const dbInstance = await db;

        const [checkResult] = await dbInstance.query(
            `SELECT COUNT(*) AS count FROM Customer WHERE CustomerID = ?`, 
            [customerID]
        );
        if (checkResult[0].count > 0) {
            return res.status(301).send({ msg: `Customer ID ${customerID} is already in use` });
        }

        await dbInstance.query(
            `INSERT INTO Customer (CustomerID, CustomerName, Phone) VALUES (?, ?, ?)`, 
            [customerID, customerName, customerPhone]
        );
        res.status(200).send({ msg: "Insert OK" });
    }
    catch (e)
    {
        res.status(500).send({ msg: e.message });
    }
});


server.put("/customers/:id", async (req, res) => {
    try
    {
        var customerId = req.params.id;
        var { customerName, customerPhone } = req.body;
        (await db).query(`update Customer set CustomerName = '${customerName}', Phone = '${customerPhone}'
                        where CustomerID = '${customerId}'`).then(([r, f]) => {
            res.status(200).send({ msg: "Update OK"});
        })
    }
    catch (e)
    {
        res.status(400).send(e);
    }
})

server.delete("/customers/:id", async (req, res) => {
    try
    {
        console.log(1);
        (await db).query(`select COUNT(*) from Invoice where CustomerID = '${req.params.id}'`)
        .then(async ([r, f]) => {
            if (r[0]['COUNT(*)'] == 0)
            {
                console.log(2);
                (await db).query(`Delete from Customer where CustomerID = '${req.params.id}'`).then(([r, f]) => 
                {
                    console.log(r);
                    res.status(200).send({ msg: `Deleted Customer ID ${req.params.id}`})
                })
            }
            else
            {
                res.status(301).send("Customer is used by InvoiceDetails, cannot delete!");
            }
        })
    }
    catch (e)
    {
        res.status(400).send(e);
    }
})

// ===============================================  CRUD Invoice  ==========================================

server.get("/invoices", async (req, res) => {
    try
    {
        var listData = [];
        (await db).query("select * from invoice").then(([result, field]) => {
            result.forEach((r) => {
                listData.push(r);
            })
            res.status(200).send(listData);
        })
    }
    catch (e)
    {
        console.log(e);
    }
})

server.get("/invoices/:id", async (req, res) => {
    try
    {
        (await db).query(`select * from Invoice where InvoiceID = '${req.params.id}'`).then(([result, field]) => {
            if (result[0] == null) {
                res.status(300).send({ msg: `No Invoice ID ${req.params.id}`});
                return;
            }
            res.status(200).send(result[0]);
            return;
        })
    }
    catch (e)
    {
        console.log(e);
    }
})

server.post("/invoices/:id", async (req, res) => {
    try
    {
        var invoiceId = req.params.id;
        var { customerId, dateIssued } = req.body;
        dateIssued = new Date(dateIssued);
        var dbInstance = await db;

        var [checkInvoice] = await dbInstance.query(
            `SELECT COUNT(*) AS count FROM Invoice WHERE InvoiceID = ?`, 
            [invoiceId]
        );
        if (checkInvoice[0].count > 0) {
            return res.status(301).send({ msg: `Invoice ID ${invoiceId} is already in use` });
        }

        const [checkCustomer] = await dbInstance.query(
            `SELECT COUNT(*) AS count FROM Customer WHERE CustomerID = ?`, 
            [customerId]
        );
        if (checkCustomer[0].count == 0) {
            return res.status(302).send({ msg: `No customer with ID ${customerId}` });
        }

        await dbInstance.query(
            `INSERT INTO Invoice (InvoiceID, CustomerID, InvoiceDate) VALUES (?, ?, ?)`, 
            [invoiceId, customerId, dateIssued]
        );
        res.status(200).send({ msg: "Insert OK" });
    }
    catch (e)
    {
        res.status(500).send({ msg: e.message });
    }
});


server.put("/invoices/:id", async (req, res) => {
    try
    {
        var invoiceId = req.params.id;
        var { dateIssued } = req.body;
        dateIssued = new Date(dateIssued);

        (await db).query(`update Invoice set InvoiceDate = ? where InvoiceID = ?`,
                        [dateIssued, invoiceId]).then(([r, f]) => {
            res.status(200).send({ msg: "Update OK"});
        })
    }
    catch (e)
    {
        res.status(400).send(e);
    }
})

server.delete("/invoices/:id", async (req, res) =>
{
    try
    {
        var invoiceId = Number(req.params.id);
        var dbInstance = await db;
        var [checkCount] = await dbInstance.query("Select COUNT(*) as count from Invoice where InvoiceID = ?", 
        [invoiceId])
        if (checkCount[0].count == 0)
        {
            return res.status(300).send({ msg: `No Invoice ID ${invoiceId}`});
        }
        dbInstance.query("Delete from Invoice where InvoiceID = ?", [invoiceId]).then(() => {
            return res.status(200).send({ msg: "Delete OK"});
        })
    }   
    catch (e)
    {
        return res.status(400).send({ msg: e.message });
    } 
})

// ============================ CRUD InvoiceDetail =================================
server.get("/invdel/:invId", async (req, res) => 
{
    try
    {
        var listData = [];
        (await db).query("select * from InvoiceDetails where InvoiceID = ?",
            [Number(req.params.invId)]
        ).then(([result, f]) => {
            result.forEach((r) => {
                listData.push(r);
            })
            res.status(200).send(listData);
        })
    }
    catch(e)
    {
        return res.status(400).send({ msg: e.message })
    }
})

server.post("/invdel/:invId", async (req, res) => {
    try
    {
        var invoiceId = Number(req.params.invId);
        var { productId, quantity } = req.body;

        var [checkCount] = await (await db).query("Select COUNT(*) as count from Invoice where InvoiceID = ?",
        [invoiceId])
        if (checkCount[0].count == 0)
        {
            return res.status(300).send({ msg: `No Invoice ID ${invoiceId}`});
        }

        [checkCount] = await (await db).query("Select COUNT(*) as count from Product where ProductID = ?", 
        [productId])
        if (checkCount[0].count == 0)
        {
            return res.status(301).send({ msg: `No Product ID ${productId}`});
        }
        [checkCount] = await (await db).query("Select COUNT(*) as count from InvoiceDetails where ProductID = ? and InvoiceID = ?", 
        [productId, invoiceId])
        console.log(checkCount)
        console.log(checkCount[0].count)
        if (checkCount[0].count != 0)
        {
            return res.status(302).send({ msg: `Invoice ID ${invoiceId} already has Product ID ${productId}, update value if needed instead!`});
        }

        var productPrice = (await (await db).query("select price from product where productid = ?", [productId]))[0][0].price;
        var invDetailPrice = productPrice * quantity;

        (await db).query("insert into InvoiceDetails (InvoiceID, ProductID, Quantity, TotalPrice) values (?, ?, ?, ?)",
                        [invoiceId, productId, quantity, invDetailPrice]
        ).then(([r, f]) => {
            res.status(200).send({  msg: "Insert OK" });
        })
    }
    catch(e)
    {
        return res.status(400).send({ msg: e.message })
    }
})

server.put("/invdel/:invId/:productId", async (req, res) =>
{
    try
    {
        var invoiceId = Number(req.params.invId);
        var productId = req.params.productId;
    
        var { quantity } = req.body;
    
        var productPrice = (await (await db).query("select price from product where productid = ?", [productId]))[0][0].price;
        var invDetailPrice = productPrice * quantity;

        (await db).query("update InvoiceDetails set Quantity = ?, TotalPrice = ? where InvoiceID = ? and ProductID = ?",
                        [quantity, invDetailPrice, invoiceId, productId]
        ).then(([r, f]) =>
        {
            res.status(200).send({  msg: "Update OK" })
        })
    }
    catch (e)
    {
        return res.status(400).send({ msg: e.message })
    }
})

server.delete("/invdel/:invId/:productId", async (req, res) =>
{
    try
    {
        (await db).query("delete from InvoiceDetails where InvoiceID = ? and ProductID = ?",
            [Number(req.params.invId), req.params.productId]
        ).then(([r, f]) => {
            res.status(200).send({ msg: "Delete OK" })
        })
    }
    catch(e)
    {
        return res.status(400).send({ msg: e.message })
    }
})