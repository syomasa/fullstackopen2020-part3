const express = require("express")
const morgan = require("morgan")

const app = express()

app.use(express.json())

morgan.token("body", (req, res) => {
	return JSON.stringify(req.body)
})


app.use(morgan(":method :url :status :res[content-length] - :response-time :body"))

let numbers = [
	{
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": 1,
		"important": true
	},
	{
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": 2
	},
	{
		"name": "Dan Abramov",
		"number": "12-43-234345",
		"id": 3
	},
	{
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": 4
	}
]

app.get("/", (request, response) => {
	response.send("<h1>You should not be here</h1>")
})

app.get("/api/persons", (request, response) => {
	response.json(numbers)
})

app.get("/info", (req, res) => {
	res.send(`<p>Phonebook has info for ${numbers.length} people<br>
			${new Date()}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const number = numbers.find(number => number.id === id)
	if (number) {
		res.json(number)
	}
	else {
		res.status(404).end()
	}
})

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	numbers = numbers.filter(note => note.id !== id)

	res.status(204).end()
})

app.post("/api/persons/", (req, res) => {
	const body = req.body

	if(!body.name || !body.number) {
		return res.status(400).json({error: "name or number missing"})
	}

	if(numbers.some(number => number.name === body.name)) {
		return res.status(400).json({error: "name must be unique"})
	}

	const number = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * Math.floor(1000))
	}

	numbers = [...numbers, number]
	res.json(number)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
