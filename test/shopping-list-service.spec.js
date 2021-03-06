const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List service object`, function() {
   let db

   let testItems = [
        {
          id: 1,
	  name: 'apples',
	  price: '5.99',
	  date_added: new Date('2100-05-22T16:28:32.615Z'),
	  checked: false,
	  category: 'Snack'
        },
        {
          id: 2,
          name: 'Chicken',
          price: '13.45',
          date_added: new Date('2100-05-22T16:28:32.615Z'),
          checked: false,
          category: 'Main'
        },
        {
          id: 3,
          name: 'Potatoes',
          price: '3.99',
          date_added: new Date('2100-05-22T16:28:32.615Z'),
          checked: false,
          category: 'Main'
        },
   ]

   before(() => {
     db = knex({
       client: 'pg',
       connection: process.env.TEST_DB_URL,
     })
   })

   before(() => db('shopping_list').truncate())

   afterEach(() => db('shopping_list').truncate())

   after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems)
    })

    it(`getAllItems() resolves all articles from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db)
        return ShoppingListService.getAllArticles(db)
           .then(actual => {
               expect(actual).to.eql(testItems.map(item => ({
                 ...item,
                 date_added: new Date(item.date_added)
               })))
           })
     })

     it(`getById() resolves an item by id from 'shopping_list' table`, () => {
       const thirdId = 3
       const thirdTestItem = testItems[thirdId - 1]
       return ShoppingListService.getById(db, thirdId)
         .then(actual => {
           expect(actual).to.eql({
             id: thirdId,
	     name: thirdTestItem.name,
	     price: thirdTestItem.price,
             date_added: thirdTestItem.date_added,
             checked: thirdTestItem.checked,
             category: thirdTestItem.category
           })
         })
     })

     it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
       const itemId = 3
       return ShoppingListService.deleteItem(db, itemId)
         .then(() => ShoppingListService.getAllItems(db))
         .then(allItems => {
           const expected = testItems.filter(item => item.id !== itemId)
           expect(allItems).to.eql(expected)
         })
     })

     it(`updateItem() updates an item from the 'shopping_list' table`, () => {
       const idOfItemToUpdate = 3
       const newItemData = {
	 name: 'Carrot',
	 price: '4.50',
	 date_added: new Date(),
	 checked: false,
	 category:'Main'
       }
       return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
         .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
         .then(item => {
           expect(item).to.eql({
             id: idOfItemToUpdate,
             ...newItemData,
           })
         })
     })

   })

    context(`Given 'blogful_articles' has no data`, () => {
      it(`getAllItems() resolves an empty array`, () => {
        return ShoppingListService.getAllItems(db)
          .then(actual => {
            expect(actual).to.eql([])
          })
      })

      it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
          const newItem = {
            name: 'Pineapple',
            price: '6.00',
            date_added: new Date(),
            checked: false,
            category:'Snack'
          }
          return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
              expect(actual).to.eql({
                id: 1,
                name: newItem.name,
                price: newItem.price,
                date_added: newItem.date_added,
                checked: newItem.checked,
                category: newItem.category
              })
            })
      })

    })
})
