import express from "express";
import Item from "../models/Item.mjs";
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
  const allItems = await Item.find().populate("restaurant");
  return res.status(200).json(allItems);
});

router.get("/getItemByRestaurant", async (req, res) => {
    const allItems = await Item.find(req.params.id)
    return res.status(200).json(allItems);
  });

export default router;
