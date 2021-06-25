import * as firebase from "../providers/connectionFirebase.js";
import { Client } from '@elastic/elasticsearch' 
import accents from 'remove-accents'
import dayjs from 'dayjs'
import http from 'http'
import got from 'got'


const bd = firebase.firestore()

const credentials = {
    username:'elastic',
    password: '7Efne1Ugt49bpV5hn6f1sWgk'
  }
  
  const client = new Client({
    node: "https://f58c35f2f0ac4ed0b5fd3ba7d02d1394.us-central1.gcp.cloud.es.io:9243",
    auth:credentials
  })



async function updateIndex(){
    try{
      await client.indices.close({index : 'tags'});
      await client.indices.putSettings({
        index : 'tags',
        body : {
          settings : {
            analysis : {
              analyzer : {
                tag_analyzer : {
                  tokenizer : 'standard',
                  filter : ["asciifolding","lowercase","product_plural"]
                }
              },
              filter : {
                product_plural : {
                  type : 'snowball',
                  lenguaje : 'Lovins'
                }
              }
            }
          }
        }
      })
  
      // await client.indices.open({index: 'tags'})
      return { code :200, message : 'Analyzer updated!'}
    }catch (error) {
        
    }

}

async function createIndexTag(){
  try{
    await client.indices.create({
      index : 'tags',
      body : {
        settings : {
          analysis : {
            analyzer : {
              tag_analyzer : {
                tokenizer : 'standard',
                filter : ["asciifolding","lowercase","tag_plurar"]
              }
            },
            filter : {
              tag_plurar : {
                type : 'snowball',
                lenguaje : 'Lovins'
              }
            }
          }
        },
        "mappings": {
            "properties": {
                "myfield": {
                    "type": "text",
                    "analyzer": "tag_analyzer",
                    "search_analyzer": "tag_analyzer"
                }
            }
        }
      }
    })
    return { code :200, message : 'Index created!'}
  }catch (error) {
      console.log(error)
  }

}

async function putMappingTag(){
  try{
    await client.indices.close({index : 'tags'});
    await client.indices.putMapping({
      index : 'tags',
      type : 'ascii',
      body : {
        properties : {
          name : {
            type : 'string',
            fields : {
              raw : {
                type : 'keyword'              
              }
            },
            analyzer: "tag_analyzer",
            search_analyzer: "tag_analyzer"
          }
        }
      }
    })
    await client.indices.open({index : 'tags'});

    return { code :200, message : 'Index created!'}
  }catch (error) {
      console.log(error)
  }

}

async function autocomplete(text){
    try{
      const { body } = await client.search({
        index : 'tags',
        body: {
          size : 100,
          query: {
            match_phrase_prefix : {
              name : text
            }
          }
        }
      })
      console.log(text)
      return body
 
    }catch (error) {
        
    }

}

async function autocompleteByProduct(text){
  try {
    const { body } = await client.search({
      index: 'products',
      body: {
        size : 100,
        query: {
          bool : {
            should : [
              {
                match : {
                  DESCR : {
                    query : text,
                    fuzziness : 'AUTO'
                  }
                }
              },
              {
                match : {
                  CAMPLIB12 : text
                }
              }
            ]
          }
        }
      }
    })

    if(body.hits.total.value > 0 && body.hits.total.value <= 2 ){
      console.log(body)
      const prodFocus = body.hits.hits[0]._source
      const category = prodFocus.LIN_PROD
      const tags  =  prodFocus.CAMPLIB12
      const arrayTags = tags.split('#')
      arrayTags.splice(0,1)

      let shouldQuery = []

      shouldQuery.push( {
        match : {
          CAMPLIB8 : {
            query : text,
            fuzziness : "AUTO"
          }
        }
      },
      {
        match : {
            LIN_PROD : {
              query : category,
          }
        },
      })

      arrayTags.forEach(tag =>{
        shouldQuery.push(
          {
            match : {
              CAMPLIB12: {
                  query : tag,
              }
            },
          }
        )
      })

      const responseByCat = await client.search({
        index: 'products',
        body: {
          size : 100,
          query: {
            bool : {
              should : shouldQuery
            }
          }
        }
      })

      return {
        code : 200,
        message : 'Search succesfull',
        data : responseByCat.body,
        tags : arrayTags
      }

    }else{
      return {
        code : 200,
        message : 'Search succesfull',
        data : body
      }
    }
    
  } catch (error) {
    console.log(error)
    return {
      code : 500,
      message : 'error to search',
      error : error
    } 
  }

}

async function uploadTags(tagList){
    const tags = tagList

    try {
        await Promise.all(
            tags.map(async tag => {
                let name = accents.remove(tag.name)
                console.log(name)
                await client.index({
                    index : 'tags',
                    type: '_doc',
                    id : tag.name,
                    body : { name : name}
                })
            })
        )

      return {
        code : 200,
        message : 'Indexes created',
      }

    } catch (error) {
      return {
        code : 500,
        message : 'error creating index',
        error : error
      } 
    }
}

async function testDate(){
  try {

    const str = new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_city' });
    let today = dayjs(str)
    let deliveryDate = today.add(1,'day');
    let expiredDate = deliveryDate.add(3,'days');
    
    let todayString = today.format('DD/MM/YYYY');
    let deliveryDateStr = deliveryDate.format('DD/MM/YYYY');
    let expiredDateStr = expiredDate.format('DD/MM/YYYY');
    let time = today.format('HH:mm a')

    return {
      status : 200,
      message : 'New test',
      data : {
        today : todayString,
        deliveryDate : deliveryDateStr,
        expiredDate : expiredDateStr,
        time : time
      }
    }


  } catch (error) {
    console.log(error)
    return {
      status : 500,
      message : 'error'
    }
  }
}

export{
    autocomplete,
    updateIndex,
    uploadTags,
    autocompleteByProduct,
    createIndexTag,
    putMappingTag,
    testDate
}
