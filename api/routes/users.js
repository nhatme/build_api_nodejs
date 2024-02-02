import express from 'express'
import { usersMethod } from '../controller/users.js'

const router = express.Router()

router.get('/', usersMethod.users_get_all)

router.post('/signup', usersMethod.users_signup)

router.post('/login', usersMethod.users_login)

router.delete('/:userId', usersMethod.users_delete_one)

export default router