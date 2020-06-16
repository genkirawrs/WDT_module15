require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})


function searchByName(searchTerm) {
  knexInstance
    .select('id', 'name', 'price', 'category', 'checked')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

//searchByName('steak')


function paginateItems(page) {
  const itemsPerPage = 6
  const offset = itemsPerPage * (page - 1)
  knexInstance
    .select('id', 'name', 'price', 'category','checked')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

//paginateItems(4)

function addedAfterDate(daysAgo) {
  knexInstance
    .select('name','date_added','price','checked')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log(result)
    })
}

//addedAfterDate(3)

function totalCategoryCost(){
  knexInstance
    .select('category')
    .sum('price')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log(result)
    })
}

totalCategoryCost()
