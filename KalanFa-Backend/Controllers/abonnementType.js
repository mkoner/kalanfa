const asyncHandler = require('express-async-handler')

const AbonnementType = require('../Models/abonnementType')

exports.createAbonnementType = asyncHandler(async(req, res) => {
    const newAbonnementType = req.body
    
    newAbonnementType.dateCreation = new Date()
    if(!newAbonnementType.nom || !newAbonnementType.prix)
        {
            res.status(400)
            throw new Error("Please fill all required fields")
        }
    await AbonnementType.create(newAbonnementType)
    res.status(201).json({
        message: "new AbonnementType created",
        data : newAbonnementType
    })
})

exports.updateAbonnementType = asyncHandler(async(req, res) => {
    const id = req.params.id
    const abonnementType = await AbonnementType.findById(id)
    if(!abonnementType){
        res.status(404)
        throw new Error(`No AbonnementType found by id ${id}`)
    }

    const updatedAbonnementType = await AbonnementType.findByIdAndUpdate(id, req.body)
    res.status(200).json({
        message : "AbonnementType updated",
        data : updatedAbonnementType
    })
})

exports.getAllAbonnementType = asyncHandler(async(req, res) => {
const abonnementType = await AbonnementType.find()
    res.status(200).json({
        message: "AbonnementTypes fetched",
        data : abonnementType
    })
})

exports.getAbonnementType = asyncHandler(async(req, res) => {
    const id = req.params.id
    abonnementType = await AbonnementType.findById(id)
    if(!abonnementType){
        res.status(404)
        throw new Error(`No AbonnementType found by id ${id}`)
    }
    res.status(200).json({
        message : "AbonnementType fetched",
        data : abonnementType
    })

})

exports.deleteAbonnementType = asyncHandler(async(req, res) => {
    const id = req.params.id
    abonnementType = await AbonnementType.findById(id)
    if(!abonnementType){
        res.status(404)
        throw new Error(`No AbonnementType found by id ${id}`)
    }
    await AbonnementType.findByIdAndDelete(id)
    res.status(200).json({
        message : "AbonnementType deleted",
        data : abonnementType
    })
})