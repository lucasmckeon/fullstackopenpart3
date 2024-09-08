import express from 'express'
const PORT = 3002
const app = express()
app.use(express.json())

app.get('/',(request,response)=>{
  response.send("<h1>Hello World!</h1>")
})

app.listen(PORT,()=>{
  console.log("Started our app on port: " + PORT)
})