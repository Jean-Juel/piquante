// getting password model.
const schemaPassword = require("../models/password");

//checking user password is ok with our password model.
module.exports = (req, res, next) => {
  if (!schemaPassword.validate(req.body.password)) {
    res.writeHead(
      400,
      "Le mot de passe doit comprendre 8 caractères dont un chiffre et une majuscule, sans espaces",
      {
        "content-type": "application/json",
      }
    );
    res.end("Le format du mot de passe est incorrect.");
  } else {
    next();
  }
};
