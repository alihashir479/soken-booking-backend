import express from 'express'
import { fetchHotel, searchHotels } from '../controllers/Hotel'
import { param } from 'express-validator'

const router = express.Router()

router.get('/search', searchHotels)
router.get('/:id', param('id').trim().notEmpty().withMessage('Hotel id is required in params'), fetchHotel)

export default router