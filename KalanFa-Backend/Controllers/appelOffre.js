const asyncHandler = require('express-async-handler')

const AppelOffre = require('../Models/appelOffre')
const Apprenant = require('../Models/apprenant')

exports.createAppelOffre = asyncHandler(async(req, res) => {
    const newAppelOffre = req.body
    
     apprenant = await Apprenant.findOne({_id:req.user._id})
    if(!apprenant){
        res.status(404)
        throw new Error(`Apprenant ${newAppelOffre.creePar} not found`)
    }

    newAppelOffre.dateCreation = new Date()
    newAppelOffre.creePar = req.user._id
    newAppelOffre.valide = true
    if(!newAppelOffre.disciplines || !newAppelOffre.addresse.ville || !newAppelOffre.addresse.commune 
        || !newAppelOffre.addresse.quartier || !newAppelOffre.niveau || !newAppelOffre.nbreApprenant || !newAppelOffre.creePar)
        {
            res.status(400)
            throw new Error("Please fill all required fields")
        }
    await AppelOffre.create(newAppelOffre)
    res.status(201).json({
        message: "new AppelOffre created",
        data : newAppelOffre
    })
})

exports.updateAppelOffre = asyncHandler(async(req, res) => {
    const id = req.params.id
    const appelOffre = await AppelOffre.findById(id)
    if(!appelOffre){
        res.status(404)
        throw new Error(`No appelOffre found by id ${id}`)
    }

    // check if appelOfre is created by authenticated user
    if(appelOffre.creePar.toString() != req.user._id.toString()) {
        res.status(401)
        throw new Error(`You are not authorized to modify this appelOffre`)
    }
    const updatedAppelOffre = await AppelOffre.findByIdAndUpdate(id, req.body)
    res.status(200).json({
        message : "AppelOffre updated",
        data : updatedAppelOffre
    })
})

exports.getAllAppelOffre = asyncHandler(async(req, res) => {
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
const appelOffre = await AppelOffre.find(filters).sort(sort)
const totalElements = appelOffre.length
const lastPage = Math.ceil(totalElements/pageSize)
if(currentPage > lastPage){
    res.status(400)
    throw new Error(`The last page is at index ${lastPage}`)
}
const appelOffrePaginated = appelOffre.slice(pageFirstItem, pageLastItem)
    res.status(200).json({
        message: "appelOffre fetched",
        data : appelOffrePaginated,
        currentPage : currentPage,
        pageSige : pageSize,
        totalElements : totalElements,
        lastPageNumber: lastPage
    })
})

exports.getAppelOffre = asyncHandler(async(req, res) => {
    const id = req.params.id
    appelOffre = await AppelOffre.findById(id)
    if(!appelOffre){
        res.status(404)
        throw new Error(`No appelOffre found by id ${id}`)
    }
    res.status(200).json({
        message : "appelOffre fetched",
        data : appelOffre
    })

})

exports.deleteAppelOffre = asyncHandler(async(req, res) => {
    const id = req.params.id
    appelOffre = await AppelOffre.findById(id)
    if(!AppelOffre){
        res.status(404)
        throw new Error(`No apprenant found by id ${id}`)
    }

    // check if appelOfre is created by authenticated user
    if(appelOffre.creePar.toString() != req.user._id.toString()) {
        res.status(401)
        throw new Error(`You are not authorized to delete this appelOffre`)
    }

    await AppelOffre.findByIdAndDelete(id)
    res.status(200).json({
        message : "appelOffre deleted",
        data : appelOffre
    })
})