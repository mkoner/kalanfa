const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Apprenant = require('../Models/apprenant')
const Enseignant = require('../Models/enseignant')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      if (decoded.subject == "apprenant")
      req.user = await Apprenant.findOne({_id : decoded.id}, {motDePasse:0})
      if (decoded.subject == "enseignant")
      req.user = await Enseignant.findOne({_id : decoded.id}, {motDePasse:0})

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }