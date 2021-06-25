
import * as service from './service.js'

async function aucompleteByTag(req,res,next){
    try {
        let text = req.params.search
        console.log(text)
        const results = await service.autocomplete(text);
        res.send(results);

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500) && next(error)
    }
}

async function aucompleteByProd(req,res,next){
    try {
        let text = req.params.search
        console.log(text)
        const results = await service.autocompleteByProduct(text);
        res.send(results);

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500) && next(error)
    }
}


async function uploadTags(req,res,next){
    try {
        let list = req.body.list
        const results = await service.uploadTags(list);
        
        res.send(results);

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500) && next(error)
    }
}

async function updateAnalyzerTags(req,res,next){
    try {
        const results = await service.updateIndex();
        
        res.send(results);

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500) && next(error)
    }
}


async function createIndexTag(req,res,next){
    try {
        const results = await service.createIndexTag();
        
        res.send(results);

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500) && next(error)
    }
}

async function putMappingTags(req,res,next){
    try {
        const results = await service.putMappingTag();
        console.log(results)
        res.send(results);

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500) && next(error)
    }
}

async function testdate(req,res,next){
    try {
        const results = await service.testDate();
        res.send(results);

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500) && next(error)
    }
}


export {
    aucompleteByTag,
    uploadTags,
    aucompleteByProd,
    updateAnalyzerTags,
    createIndexTag,
    putMappingTags,
    testdate
}