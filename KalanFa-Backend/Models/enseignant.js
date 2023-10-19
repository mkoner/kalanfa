// import the mongoose
const mongoose = require('mongoose');

// create a schema
const Schema = mongoose.Schema;

const enseignantSchema = new Schema({
    nom: {type: String, required: [true, "L'email ne peut etre vide"]},
    prenom: {type: String, required: true},
    addresse: {type: {
        ville: {type: String, required: true},
        commune: {type: String, required: true},
        quartier: {type: String, required: true},
        rue: {type: String, required: false},
        description: {type: String, required: false},
        longitude: {type: Number, required: false},
        lagitude: {type: Number, required: false}
    }, 
        required: [true, "L'email ne peut etre vide"]},
    email: {type: String, required: [true, "L'email ne peut etre vide"], unique : [true, "email existe deja"]},
    numero: {type: String, required: [true, "numero ne peut etre vide"], unique : [true, "numero existe deja"]},
    motDePasse: {type: String, required: [true, "mot de passe ne peut etre vide"]},
    disciplinesEnseignes: {type: [String], required: [true, "disciplines enseignes ne peut etre vide"]},
    niveauxEnseignes: {type: [String], required: [true, "niveaux enseignes ne peut etre vide"]},
    cv: {type: String, required: [true, "CV ne peut etre vide"]},
    photoDeProfile: {type: String, required: [true, "photo ne peut etre vide"]},
    experiencePro: {type: [
        {
            position : { type: String, required : true},
            compagnie : { type: String, required : true},
            dateDebut : { type: String, required : true},
            dateFin : { type: String, required : false},
            description : { type: String, required : false}
        }
    ], required: [true, "experience Pro ne peut etre vide"]},
    formation: {type: [
        {
            etablissement : { type: String, required : true},
            filiere : { type: String, required : true},
            dateDebut : { type: String, required : true},
            dateFin : { type: String, required : false},
            description : { type: String, required : false}
        }
    ], required: [true, "formation ne peut etre vide"]},
    dateInscription:{ type: Date, required: [true, "date inscription ne peut etre vide"]},
    abonnement : {type: mongoose.Schema.Types.ObjectId, ref: "Abonnement"}
})

module.exports = mongoose.model('Enseignant', enseignantSchema, 'enseignant');