const asyncHandler = require('express-async-handler')
const dayjs = require('dayjs')

const Abonnement = require('../Models/abonnement')
const Enseignant = require('../Models/enseignant')
const AbonnementType = require('../Models/abonnementType')

exports.createAbonnement = asyncHandler(async(req, res) => {
    const newAbonnement = req.body
    if(!newAbonnement.nom )
    {
        res.status(400)
        throw new Error("Please fill all required fields")
    }
    abonnementType = await AbonnementType.findOne({name:req.body.name})
    if(!abonnementType){
        res.status(404)
        throw new Error(`AbonnementType not found`)
    }
    enseignant = await Enseignant.findOne({_id:req.user._id})
    if(!enseignant){
        res.status(404)
        throw new Error(`Enseignant not found`)
    }

    newAbonnement.dateAchat = new Date()
    newAbonnement.achetePar = req.user._id
    newAbonnement.credits = abonnementType.credits
    newAbonnement.prix = abonnementType.prix
    newAbonnement.valide = true
    if(abonnementType.validite)
    newAbonnement.dateExpiration = dayjs().add(abonnementType.validite, 'month')
  
    createdAbonnement = await Abonnement.create(newAbonnement)
    
    await Enseignant.findByIdAndUpdate(enseignant._id.toString(),{
        abonnement: createdAbonnement._id
    })
    res.status(201).json({
        message: "new Abonnement created",
        data : createdAbonnement
    })
})

exports.updateAbonnement = asyncHandler(async(req, res) => {
    const id = req.params.id
    const abonnement = await Abonnement.findById(id)
    if(!abonnement){
        res.status(404)
        throw new Error(`No Abonnement found by id ${id}`)
    }
    const updatedAbonnement = await Abonnement.findByIdAndUpdate(id, req.body)
    res.status(200).json({
        message : "Abonnement updated",
        data : updatedAbonnement
    })
})

exports.getAllAbonnement = asyncHandler(async(req, res) => {
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

    if(reqDate.dateCreationDebut && reqDate.dateCreationFin) {
        filters.dateCreation = {
            $lte: reqFilters.dateCreationFin,
            $gte: reqFilters.dateCreationDebut
        }
    }
const abonnement = await Abonnement.find(filters).sort(sort)
const totalElements = abonnement.length
const lastPage = Math.ceil(totalElements/pageSize)
if(currentPage > lastPage){
    res.status(400)
    throw new Error(`The last page is at index ${lastPage}`)
}
const abonnementPaginated = abonnement.slice(pageFirstItem, pageLastItem)
    res.status(200).json({
        message: "Abonnement fetched",
        data : abonnementPaginated,
        currentPage : currentPage,
        pageSige : pageSize,
        totalElements : totalElements,
        lastPageNumber: lastPage
    })
})

exports.getAbonnement = asyncHandler(async(req, res) => {
    const id = req.params.id
    abonnement = await Abonnement.findById(id)
    if(!abonnement){
        res.status(404)
        throw new Error(`No Abonnement found by id ${id}`)
    }
    res.status(200).json({
        message : "Abonnement fetched",
        data : abonnement
    })

})

exports.runSetAbonnementValidity = asyncHandler(async() =>{
    console.log("runSetAbonnementValidity called")
    const abonnements = await Abonnement.find()
    console.log(abonnements)
    abonnements.map(
        async abonnement => {
           if((abonnement.dateExpiration && abonnement.dateExpiration < new Date()) || abonnement.credits == 0)
               await Abonnement.findByIdAndUpdate(abonnement._id.toString(), {valide:false})
       }
   )
   console.log("setAbonnementValidity job run at " + new Date())
})

exports.deleteAbonnement = asyncHandler(async(req, res) => {
    const id = req.params.id
    abonnement = await Abonnement.findById(id)
    if(!abonnement){
        res.status(404)
        throw new Error(`No apprenant found by id ${id}`)
    }


    await Abonnement.findByIdAndDelete(id)
    res.status(200).json({
        message : "Abonnement deleted",
        data : abonnement
    })
})