const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
 
const Apprenant = require('../Models/apprenant')


exports.createApprenant = asyncHandler(async(req, res) => {
    const newApprenant = req.body

      // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(newApprenant.motDePasse, salt)
    newApprenant.motDePasse = hashedPassword

    apprenantByNumero = await Apprenant.findOne({numero:newApprenant.numero})
    apprenantByEmail = await Apprenant.findOne({email:newApprenant.email})
    if(apprenantByNumero != null){
        res.status(404)
        throw new Error(`Number ${newApprenant.numero} already exists`)
    }
    if(apprenantByEmail != null){
        res.status(404)
        throw new Error(`Email ${newApprenant.email} already exists`)
    }
    newApprenant.dateInscription = new Date()
    if(!newApprenant.nom || !newApprenant.prenom || !newApprenant.addresse.ville || !newApprenant.addresse.commune 
        || !newApprenant.addresse.quartier || !newApprenant.email || !newApprenant.numero || !newApprenant.motDePasse)
        {
            res.status(400)
            throw new Error("Please fill all required fields")
        } 
    await Apprenant.create(newApprenant)
    res.status(201).json({
        message: "new apprenants created",
        data : newApprenant
    })
})

exports.login = asyncHandler(async(req, res) =>{
    const { email, motDePasse } = req.body
    const apprenant = await Apprenant.findOne({ email})
    if (apprenant && (await bcrypt.compare(motDePasse, apprenant.motDePasse)))
    {
        token = generateToken(apprenant._id)
        res.set('token', token)
        res.status(200).json({
            user: apprenant
        })
    }else {
        res.status(400)
        throw new Error('Invalid credentials')
      }
} )

exports.updateApprenant = asyncHandler(async(req, res) => {
    console.log("updateApprenant invoked")
    const id = req.params.id
    apprenantByNumero = await Apprenant.findOne({numero:req.body.numero})
    apprenantByEmail = await Apprenant.findOne({email:req.body.email})
    const apprenant = await Apprenant.findById(id)
    if(!apprenant){
        res.status(404)
        throw new Error(`No apprenant found by id ${id}`)
    }
    if(apprenantByNumero != null && req.body.numero != apprenant.numero){
        res.status(404)
        throw new Error(`Number ${req.body.numero} already exists`)
    }
    if(apprenantByEmail != null && req.body.email != apprenant.email){
        res.status(404)
        throw new Error(`Email ${req.body.email} already exists`)
    }
    const updatedApprenant = await Apprenant.findByIdAndUpdate(id, req.body).select('-motDePasse')
    res.status(200).json({
        message : "apprenant updated",
        data : updatedApprenant
    })
})

exports.getAllApprenantsNoFilter = asyncHandler(async(req, res) => {
    const apprenant = Apprenant.find()
    res.status(200).json({
        message: "Apprenants fetched",
        data: apprenant
    })
})

exports.getAllApprenants = asyncHandler(async(req, res) => {
    const filters = {}
    const page = req.body.page
    const reqFilters = req.body.filters
    const reqSort = req.body.sort
    const sort = {}
    if(reqSort)
    sort[reqSort.field] = reqSort.order
    const reqDate = req.body.date

    const currentPage = parseInt(page.current)
    const pageSize = parseInt(page.max) 
    
    if(currentPage < 1){
        res.status(400)
        throw new Error(`Current Page number should not be less than 1`)
    }
    const pageFirstItem = (currentPage - 1) * pageSize
    const pageLastItem = currentPage * pageSize 
    var property = ""
    for (property in reqFilters) {
        const value = reqFilters[property]
        filters[property] = {$regex: value, "$options": "i" }
    }

    if(reqDate.dateInscriptionDebut && reqDate.dateInscriptionFin) {
        filters.dateInscription = {
            $lte: reqFilters.dateInscriptionFin,
            $gte: reqFilters.dateInscriptionDebut
        }
    }
const apprenants = await Apprenant.find(filters, {motDePasse:0}).sort(sort)
const totalElements = apprenants.length
const lastPage = Math.ceil(totalElements/pageSize)
if(currentPage > lastPage){
    res.status(400)
    throw new Error(`The last page is at index ${lastPage}`)
}
const apprenantsPaginated = apprenants.slice(pageFirstItem, pageLastItem)
    res.status(200).json({
        message: "apprenants fetched",
        data : apprenantsPaginated,
        currentPage : currentPage,
        pageSige : pageSize,
        totalElements : totalElements,
        lastPageNumber: lastPage
    })
})

exports.getApprenant = asyncHandler(async(req, res) => {
    const id = req.params.id
    const apprenant = await Apprenant.findOne({_id: id}, {motDePasse:0})
    if(!apprenant){
        res.status(404)
        throw new Error(`No apprenant found by id ${id}`)
    }
    res.status(200).json({
        message : "apprenant fetched",
        data : apprenant
    })
})

exports.deleteApprenant = asyncHandler(async(req, res) => {
    let id = req.params.id
    apprenant = await Apprenant.findOne({_id: id}, {motDePasse:0})
    if(!apprenant){
        res.status(404)
        throw new Error(`No apprenant found by id ${id}`)
    }
    await Apprenant.findByIdAndDelete(id)
    res.status(200).json({
        message : "apprenant deleted",
        data : apprenant
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({
         id:id, 
         issuer: "KalanFa",
         subject: "apprenant"
        }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
  }

