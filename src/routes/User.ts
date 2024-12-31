import express from 'express'
import { login, register } from '../controllers/User'
import { userLoginValidation, userRegisterValidation } from '../middlware/validation'

const router = express.Router()
router.post('/register', userRegisterValidation, register)
router.post('/login', userLoginValidation, login)

export default router