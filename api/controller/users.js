import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../model/user.js'
import { format } from 'date-fns'

const timestamp = format(new Date(), "yyyy-MM-dd'  'HH:mm:ss");

const users_get_all = (req, res, next) => {
    User.find()
        .exec()
        .then(result => {
            res.status(200).json({ result })
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                status: false,
                message: err
            })
        })
}

const users_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user)
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    message: 'Email is not valid',
                                    error: err
                                })
                            })
                    }
                })
            }
        })
}

const users_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    status: false,
                    createdAt: timestamp.toString(),
                    message: `No Account`,
                    token: null
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: `Auth failed 1`
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        "secret",
                        {
                            expiresIn: "2h"
                        }
                    )
                    return res.status(200).json({
                        status: true,
                        createdAt: timestamp.toString(),
                        message: 'Auth Successful !',
                        token: token
                    })
                }

                res.status(401).json({
                    status: false,
                    createdAt: timestamp.toString(),
                    message: `Auth failed 2`,
                    token: null
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

const users_delete_one = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId }).exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted!'
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

export const usersMethod = {
    users_get_all,
    users_signup,
    users_login,
    users_delete_one
}