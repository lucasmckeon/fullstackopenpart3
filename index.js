import express from 'express'

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const PORT = 3001
const app = express()
app.use(express.json())

app.get('/',(request,response)=>{
  response.send("<h1>Phonebook</h1>")
})

app.get('/api/persons',(request,response)=>{
  response.json(phonebook)
})

app.get('/api/persons/:id',(request,response)=>{
  const id = request.params.id
  if(!phonebook.find(person => person.id === id)){
    response.status(404).end()
  }
  response.json(phonebook[id])
})

app.get('/info',(request,response)=>{
  const date = (new Date()).toString()
  const peopleCount = phonebook.length
  response.send(`<div><p>Phonebook has info for ${peopleCount} people</p><p>${date}</p></div>`)
})

app.delete('/api/persons/:id',(request,response)=>{
  const id = request.params.id
  if(!phonebook.find(person => person.id === id)){
    response.status(404).send(`Deletion of person with id:${id} failed as that person does not exist`)
  }
  phonebook = phonebook.filter(person => person.id!==id)
  response.sendStatus(204)
})

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


function generateId(){
  const rand = getRandomInt(0,1000)
  if(phonebook[rand]){
    return generateId()
  }
  return rand
}

app.post('/api/persons',(request,response)=>{
  const data = request.body
  if(!data.name || !data.number){
    //422 : Unprocessable Entity 
    response.status(422).send({error:'name and number must be provided'})
    return
  }
  if(phonebook.find(person => person.name === data.name)){
    //409: Conflict 
    response.status(409).send({error:`Person with name ${data.name} already exists`})
    return
  }
  const person = {
    name:data.name,
    number:data.number,
    id:generateId()
  }
  phonebook.push(person)
  response.json(person)
})

app.listen(PORT,()=>{
  console.log("Started our app on port: " + PORT)
})