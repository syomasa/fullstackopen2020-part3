require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Pnumber = require("./models/phonenumber")

app.use(express.json())
app.use(express.static("build"))

morgan.token("body", (req, res) => {
	return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time :body"))
app.use(cors())

app.get("/", (request, response) => {
	response.send("<h1>You should not be here</h1>")
})

app.get("/api/persons", (request, response) => {
	Pnumber.find({}).then(numbers => {
		response.json(numbers)
	})
})

app.get("/info", (req, res) => {
	res.send(`<p>Phonebook has info for ${numbers.length} people<br>
			${new Date()}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
	Pnumber.findById(req.params.id).then(num => {
		res.json(num)
	})
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

	const number = new Pnumber({
		name: body.name,
		number: body.number
	})

	number.save().then(savedNumber => {
		res.json(savedNumber)
		// console.log(savedNumber)
	})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
