const service = require('./service')

const addLog = async (req, res, next) => {
    try {
      const logData = req.body
      await service.add(logData)
      res.send({message : 'Log creado', status : true})
      next()
    } catch(e) {
      console.log(e.message)
      res.sendStatus(500) && next(e)
    }
}

const listLogs = async (req, res, next) => {
  try {
    const data = await service.list()
    res.send({message : 'Succesfull query', data : data,  status : true})
    next()
  } catch(e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}

module.exports = {
    addLog,
    listLogs
} 