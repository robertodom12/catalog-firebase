
import * as service from './service.js'


async function getCatalogProducts(req,res,next){
    try {
        await service.exportProducts();
        res.send({code : 200, message : 'file upload to bucket'})

    } catch (error) {
        console.log(error.message)
        res.send({code : 500, error : error}) && next(error)
    }
}

async function runBackgroundJobCat(req,res,next){
    try {
        let offert = req.params.type
        const response = await service.initCatalogTask(offert);
        res.send(response);
    } catch (error) {
        
    }
}


async function statusBackgroundJobCat(req,res,next){
    try {
        let id = req.params.id
        const response = await service.getTaskStatus(id);
        res.send(response);
    } catch (error) {
        
    }
}

export {
    runBackgroundJobCat,
    statusBackgroundJobCat,
    getCatalogProducts
}