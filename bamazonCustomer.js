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
          let itemChoice
         for (let i = 0; i < data.length; i++) {
           if (data[i].item_id === parseInt(answers.item)) {
             if (data[i].stock_quantity >= parseInt(answers.quantity)) {
               console.log('hi')
             } else {
               console.log('Insufficient quantity!')
               purchaseItem()
             }
           } 
         }
        })
        .catch(e => console.log(e))
  })
}