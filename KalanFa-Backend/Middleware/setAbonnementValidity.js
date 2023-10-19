const Abonnement = require('../Models/abonnement')
const asyncHandler = require('express-async-handler')

const setAbonnementValidity = abonnements => {
    abonnements.map(
         abonnement => {
            if(abonnement.dateExpiration < new Date() || abonnement.credit == 0)
               async() => await Abonnement.findByIdAndUpdate(abonnement._id, {valide:false})
        }
    )
    console.log("setAbonnementValidity job run at " + new Date())
}

module.exports = {
    setAbonnementValidity
}

