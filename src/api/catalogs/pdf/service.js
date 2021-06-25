import * as firebase from "../../providers/connectionFirebase.js";
import pdf from 'pdf-creator-node'
import fs from 'fs'
import util from 'util'
import path from 'path'
import Queue from 'bull'
import { uuid } from 'uuidv4';
import {io} from '../../../app.js';
import { Catalog } from "./model.js";

let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('catalog', REDIS_URL);

const bd = firebase.firestore()
const bucket = firebase.storage()

workQueue.process(async function (job) {
    try {
        const response = await exportProducts(job)
        Promise.resolve(response)
    } catch (error) {
       Promise.reject(error)
    }
})

async function initCatalogTask(type){
    try {
        let job = await workQueue.add({type : type});
        return ({id : job.id, message : 'TASK INIT'})
    
    } catch (error) {
        Promise.reject(error)
    }

}

async function exportProducts(job){
    try {
    
    let type = job.data.type
    let catalog = new Catalog(type)
    let catalogRef = catalog.getReferences()
    let html = fs.readFileSync(catalogRef.templatePath, 'utf8');
    let imgSrc = "file:///app/src/api/catalogs/pdf/templates/"+"logo.jpg";
    imgSrc = path.normalize(imgSrc);
    let productsHTML = []
        
    let products = await catalogRef.firebaseQuery.get()

    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            contents: "",
            height: "35mm",
        },
        "footer": {
            "height": "12mm",
            "contents": ""
        },
        timeout: 300000000
    };

    products.docs.forEach(function (arrayItem) {
        let product = arrayItem.data()
        let price = parseFloat(product.CAMPLIB13)
        if(type == 2 && product.CAMPLIB18 == 'N') product.CAMPLIB13 = (price-((price*5)/100)).toFixed(2)
        product.url = product.CAMPLIB10 != "" ? product.CAMPLIB10[0].url : ""
        productsHTML.push(product)
    });

    var document = {
        html: html,
        data: {
            users: productsHTML,
            imgSrc : imgSrc,
        },
        path: catalogRef.outputPath
    };

    const response = await pdf.create(document, options)
    let url = path.normalize(response.filename)
    let id = uuid()
    const metadata = {
        metadata :{
            firebaseStorageDownloadTokens: id
        },
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000',
      };
      
    await bucket.upload(url, {
        gzip: true,
        metadata: metadata,
        destination : catalogRef.storageRef
    });
    
    io.emit('pdfTask',{
        status : true,
        id : id,
        jobId : job.id,
        type : type
    })
    
    return true

    } catch (error) {
        console.log(error)
    }
}

async function getTaskStatus(id) {
    try {
        let job = await workQueue.getJob(id);
      
        if (job === null) {
          res.status(404).end();
        } else {
          let state = await job.getState();
          let progress = job._progress;
          let reason = job.failedReason;
          return { id : id, state :state, progress : progress, reason : reason }
        }
    } catch (error) {
        return {code : 500, error : error}
    }
};

function getReferenceByType(params) {
    
}
  

export{
    initCatalogTask,
    getTaskStatus,
    exportProducts
}