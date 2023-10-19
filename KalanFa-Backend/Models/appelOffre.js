// import the mongoose
const mongoose = require('mongoose');

// create a schema
const Schema = mongoose.Schema;

const appelOffreSchema  = new Schema({
    disciplines: {type: [String], required: true},
    addresse: {type: [{
        ville: {type: String, required: true},
        commune: {type: String, required: true},
        quartier: {type: String, required: true},
        rue: {type: String, required: false},
        description: {type: String, required: false},
        longitude: {type: Number, required: false}
    }], 
        required: true},
    niveau: {type: [String], required: true},
    nbreApprenant: {type: Number, required: true},
    creePar: {type: mongoose.Schema.Types.ObjectId, ref: "Apprenant", required: true},
    dateCreation:{ type: String, default: Date.now},
    valide: {type : Boolean, default: true, required: true }
})

module.exports = mongoose.model('AppelOffre', appelOffreSchema, 'appelOffre');