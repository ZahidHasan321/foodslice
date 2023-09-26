import express from "express";
import Item from "../models/Item.mjs";
import Restaurant from "../models/Restaurant.mjs";
import User from "../models/User.mjs"
const router = express.Router();

router.post("/", async (req, res) => {
console.log(req.body)
  const newItem = new Item(req.body);
  const isFound = await Item.exists({
    name: req.body.name,
    category: req.body.category,
    restaurant: req.body.restaurant,
  });

  if (isFound) {
    return res.status(201).json({ message: "Already exits" });
  } else {
    const insertedItem = await newItem.save();
    return res.status(200).json(insertedItem);
  }
});

router.get("/", async (req, res) => {
  const allItems = await Item.find().populate({
    path:'restaurant',
    populate:{
      path:'owner'
    }
  });
  return res.status(200).json(allItems);
});

router.get("/getItems", async (req, res) => {

  User.findOne({uid: req.query.id}, '_id')
  .then(userId => {
    Restaurant.findOne({owner: userId}, '_id')
    .then( id => {
      Item.find({restaurant: id})
      .then(items => {
        return res.status(200).json(items)
      })
    })
  })


  
    
  });

export default router;
