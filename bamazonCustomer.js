const inquirer = require('inquirer')
const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bamazon_db'
})

// a prompt that shows all the items from MySQL
db.query('SELECT item_id, product_name, price FROM products', (e, data) => {
  if (e) {
    console.log(e)
  }
  console.table(data)
  purchaseItem()
})

// asking the two questions to user of what they want to buy and how much
let purchaseItem = () => {
  db.query(`SELECT*FROM products`, (e, data) => {
    if (e) {
      console.log(e)
    }
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'item',
            message: 'Please enter the ID of the product you woud like to buy'
          },
          {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to buy?'
          }
        ])
        .then(answers => {
          
         for (let i = 0; i < data.length; i++) {
           if (data[i].item_id === parseInt(answers.item)) {
             if (data[i].stock_quantity >= parseInt(answers.quantity)) {
              let itemPrice = parseInt(data[i].price)
               db.query(`UPDATE products SET stock_quantity = ${data[i].stock_quantity} - ${parseInt(answers.quantity)} WHERE item_id = ${data[i].item_id}`, (e, data) => {
                 if (e) {
                   console.log(e)
                 }
                 let sum = `${itemPrice} `
                 console.log(`
                 -------------------------------------------------------------------
                 Your Purchase was successful!!!!
                 Your total is $${itemPrice * parseInt(answers.quantity)} dollars
                 -------------------------------------------------------------------
                 `)
                 purchaseItem()
               })
             } else {
               console.log(`
               ---------------------------------------------------------------------
               Insufficient quantity!
               ---------------------------------------------------------------------
               `)
               purchaseItem()
             }
           } 
         }
        })
        .catch(e => console.log(e))
  })
}


