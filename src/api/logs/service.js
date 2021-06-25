const {Log} = require('./model')
const dayjs = require('dayjs')



const add = async(logData) =>{
    try {
        logData.date = dayjs().format();
        const log = new Log(logData);
        await log.save()
        return true

    } catch (err) {
        return err
    }
}

const list = async()=>{
    try {
      const logs = await Log.find();
      var sortLogs = [];

      logs.forEach(element => {
        var index = sortLogs.findIndex(i => i.searchedWord === element.searchedWord)    
            if(index < 0){
                sortLogs.push({type : element.type,searchedWord : element.searchedWord,qtyResults : element.qtyResults, qtySearched : 1})
            }else{
                sortLogs[index].qtyResults+= element.qtyResults
                sortLogs[index].qtySearched++
            }
        });
        
      return sortLogs
    } catch (error) {
        
    }
}

module.exports = {
    add,
    list
}