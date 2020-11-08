require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Pnumber = require("./models/phonenumber")
const { response } = require("express")
const { update } = require("./models/phonenumber")

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name == "CastError") {
		return response.status(400).send({error: "malformatted id"})
	}
	next(error)
}

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
	Pnumber.find({}).then(numbers => {
		res.send(`There are contacts for ${numbers.length} people.<br>Today is ${new Date()}`)
	})
})

app.get("/api/persons/:id", (req, res, next) => {
	Pnumber.findById(req.params.id).then(num => {
		if (num) {
			res.json(num)
		} else {
			response.status(404).end()
		}
	})
		.catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
	Pnumber.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
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

app.put("/api/persons/:id", (req, res, next) => {
	const body = req.body

	const contact = {
		name: body.name,
		number: body.number
	}

	Pnumber.findByIdAndUpdate(req.params.id, contact)
		.then(updatedNote => {
			res.json(updatedNote)
		})
		.catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
