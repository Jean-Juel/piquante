const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  let sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    userLiked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce
    .save()
    .then(() => res.status(201).json({message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      if (filename.substring(-1, filename.indexOf('.')) !== req.body.filename) {
        fs.unlink(`images/${filename}`, (err) => {
          if (err)
            console.log(err)
        })
      }
      const sauceObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
      Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({error}));
    })
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({error}));
      });
    })
    .catch(error => res.status(500).json({error}));
};

exports.getOneSauce = async (req, res, next) => {
  try {
    let result = await Sauce.findOne({_id: req.params.id})
    return res.status(200).json(result)
  } catch (err) {
    return res.status(404).json(err)
  }
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.likeSauce = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;
  // 1. user likes a sauce for the first time (like === 1)
  // pushing the userId to usersLiked array; incrementing likes
  if (like === 1) {
    Sauce.updateOne(
      {_id: sauceId},
      {
        $inc: {likes: +1},
        $push: {usersLiked: userId},
      }
    )
      .then(() => res.status(200).json({message: "Sauce liker"}))
      .catch((error) => res.status(500).json({error}));
  } else if (like === -1) {
    Sauce.updateOne(
      {_id: sauceId},
      {
        $inc: {dislikes: +1},
        $push: {usersDisliked: userId},
      }
    )
      .then(() => res.status(200).json({message: "Sauce disliker"}))
      .catch((error) => res.status(500).json({error}));
  } else {
    Sauce.findOne(
      {_id: sauceId})
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            {_id: sauceId},
            {$pull: {usersLiked: userId}, $inc: {likes: -1}}
          )
            .then(() => res.status(200).json({message: "Sauce non appréciée"}))
            .catch((error) => res.status(500).json({error}));
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            {_id: sauceId},
            {$pull: {usersDisliked: userId}, $inc: {dislikes: -1}}
          )
            .then(() => res.status(200).json({message: "Sauce appréciée"}))
            .catch((error) => res.status(500).json({error}));
        }
      })
      .catch((error) => res.status(500).json({error}));
  }
};

