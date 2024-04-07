const express = require('express')
const router = express.Router()

const { PlantCareError } = require('../utils/errors')

// In-memory array to store plant care information
let plants = [
  { id: 1, name: 'Snake Plant', type: 'Indoor', sunlight: 'Low', watering: 'Low' },
  { id: 2, name: 'Fiddle Leaf Fig', type: 'Indoor', sunlight: 'High', watering: 'Medium' },
  { id: 3, name: 'Peace Lily', type: 'Indoor', sunlight: 'Low', watering: 'High' },
  { id: 4, name: 'Cactus', type: 'Outdoor', sunlight: 'High', watering: 'Low' },
  { id: 5, name: 'Succulent', type: 'Outdoor', sunlight: 'Medium', watering: 'Low' }
]

// Utility function to find a plant by id
const findPlantById = (id) => plants.find(plant => plant.id === id)

// Create a new plant entry
router.post('/', (req, res) => {
  const { name, type, sunlight, watering } = req.body

  const newPlant = { id: plants.length + 1, name, type, sunlight, watering }
  plants.push(newPlant)

  res.status(201).send(newPlant)
})

// Read all plants or filter by type and/or sunlight requirements
router.get('/', (req, res) => {
  const { type, sunlight } = req.query

  let filteredPlants = plants

  // Filter by type if type query parameter is provided
  if (type) {
    filteredPlants = filteredPlants.filter(plant => plant.type.toLowerCase() === type.toLowerCase())
  }

  // Filter by sunlight if sunlight query parameter is provided
  if (sunlight) {
    filteredPlants = filteredPlants.filter(plant => plant.sunlight.toLowerCase() === sunlight.toLowerCase())
  }

  res.status(200).send(filteredPlants)
})

// Read a single plant by id
router.get('/:id', (req, res, next) => {
  const plant = findPlantById(parseInt(req.params.id))

  // Send the PlantCareError if the plant is not found
  if (!plant) {
    return next(new PlantCareError('Plant not found', 404))
  }

  res.status(200).send(plant)
})

// Update a plant by id
router.put('/:id', (req, res) => {
  const { name, type, sunlight, watering } = req.body
  const plant = findPlantById(parseInt(req.params.id))

  if (plant) {
    plant.name = name
    plant.type = type
    plant.sunlight = sunlight
    plant.watering = watering
    res.status(200).send(plant)
  } else {
    res.status(404).send({ message: 'Plant not found' })
  }
})

// Delete a plant by id
router.delete('/:id', (req, res) => {
  const plantId = parseInt(req.params.id)
  const plantIndex = plants.findIndex(plant => plant.id === plantId)

  if (plantIndex > -1) {
    plants = plants.filter(plant => plant.id !== plantId)
    res.status(200).send({ message: 'Plant deleted successfully' })
  } else {
    res.status(404).send({ message: 'Plant not found' })
  }
})

module.exports = router
