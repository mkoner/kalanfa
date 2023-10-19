const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Enseignant = require('../Models/enseignant')

exports.createEnseignant = asyncHandler(async(req, res) => {
    const newEnseignant = req.body

          // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(newEnseignant.motDePasse, salt)
    newEnseignant.motDePasse = hashedPassword
    
    enseignantByNumero = await Enseignant.findOne({numero:newEnseignant.numero})
    enseignantByEmail = await Enseignant.findOne({email:newEnseignant.email})
    if(enseignantByNumero != null){
        res.status(404)
        throw new Error(`Number ${newEnseignant.numero} already exists`)
    }
    if(enseignantByEmail != null){
        res.status(404)
        throw new Error(`Email ${newEnseignant.email} already exists`)
    }
    newEnseignant.dateInscription = new Date()
    console.log(newEnseignant)
    if(!newEnseignant.nom || !newEnseignant.prenom || !newEnseignant.addresse.ville || !newEnseignant.addresse.commune 
        || !newEnseignant.addresse.quartier || !newEnseignant.email || !newEnseignant.numero || !newEnseignant.motDePasse
        || !newEnseignant.experiencePro.position || !newEnseignant.experiencePro.compagnie || !newEnseignant.experiencePro.dateDebut
        || !newEnseignant.formation.etablissement || !newEnseignant.formation.filiere || !newEnseignant.formation.dateDebut)
        {
            res.status(400)
            throw new Error("Please fill all required fields")
        }
    await Enseignant.create(newEnseignant)
    res.status(201).json({
        message: "new enseignant created",
        data : newEnseignant
    })
})

exports.login = asyncHandler(async(req, res) =>{
    const { email, motDePasse } = req.body
    const enseignant = await Enseignant.findOne({ email})
    if (enseignant && (await bcrypt.compare(motDePasse, enseignant.motDePasse)))
    {
        token = generateToken(enseignant._id)
        res.set('token', token)
        res.status(200).json({
            user: enseignant
        })
    }else {
        res.status(400)
        throw new Error('Invalid credentials')
      }
} )

exports.updateEnseignant = asyncHandler(async(req, res) => {
    const id = req.params.id
    enseignantByNumero = await Enseignant.findOne({numero:req.body.numero})
    enseignantByEmail = await Enseignant.findOne({email:req.body.email})
    const enseignant = await Enseignant.findById(id)
    if(!enseignant){
        res.status(404)
        throw new Error(`No enseignant found by id ${id}`)
    }
    if(enseignantByNumero != null && req.body.numero != enseignant.numero){
        res.status(404)
        throw new Error(`Number ${req.body.numero} already exists`)
    }
    if(enseignantByEmail != null && req.body.email != enseignant.email){
        res.status(404)
        throw new Error(`Email ${req.body.email} already exists`)
    }
    const updatedEnseignantt = await Enseignant.findByIdAndUpdate(id, req.body).select('-motDePasse')
    res.status(200).json({
        message : "enseignant updated",
        data : updatedEnseignantt
    })
})

exports.getAllEnseignants = asyncHandler(async(req, res) => {
    const filters = {}
    const page = req.body.page
    const reqFilters = req.body.filters
    const reqSort = req.body.sort
    const sort = {}
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
const enseignant = await Enseignant.find(filters, {motDePasse:0}).sort(sort)
const totalElements = enseignant.length
const lastPage = Math.ceil(totalElements/pageSize)
if(currentPage > lastPage){
    res.status(400)
    throw new Error(`The last page is at index ${lastPage}`)
}
const enseignantPaginated = enseignant.slice(pageFirstItem, pageLastItem)
    res.status(200).json({
        message: "enseignant fetched",
        data : enseignantPaginated,
        currentPage : currentPage,
        pageSige : pageSize,
        totalElements : totalElements,
        lastPageNumber: lastPage
    })
})

exports.getEnseignant = asyncHandler(async(req, res) => {
    const id = req.params.id
    enseignant = await Enseignant.findOne({_id:id}, {motDePasse:0})
    if(!enseignant){
        res.status(404)
        throw new Error(`No enseignant found by id ${id}`)
    }
    res.status(200).json({
        message : "enseignant fetched",
        data : enseignant
    })

})

exports.deleteEnseignant = asyncHandler(async(req, res) => {
    const id = req.params.id
    enseignant = await Enseignant.findOne({_id:id}, {motDePasse:0})
    if(!enseignant){
        res.status(404)
        throw new Error(`No enseignant found by id ${id}`)
    }
    await Enseignant.findByIdAndDelete(id)
    res.status(200).json({
        message : "enseignant deleted",
        data : enseignant
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({
         id:id, 
         issuer: "KalanFa",
         subject: "enseignant"
        }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
  }