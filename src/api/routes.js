import express from 'express'
import * as catalogs from './catalogs/pdf/controller.js'
import * as products from './products/controller.js'

const router = express.Router()


//CATALOGS
router.get('/catalogs/product/:type',catalogs.runBackgroundJobCat)
router.get('/catalogs/job/:id',catalogs.statusBackgroundJobCat)


//AUTOCOMPLETE 
router.get('/products/tags/:search',products.aucompleteByTag)
router.get('/products/:search',products.aucompleteByProd)
router.post('/products/tags/upload',products.uploadTags)
router.get('/products/tags/index/create',products.createIndexTag)
router.get('/products/tags/analyzer/update',products.updateAnalyzerTags)
router.get('/products/tags/mapping/create',products.putMappingTags)

export{
    router
} 


