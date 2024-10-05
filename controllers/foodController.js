import foodModel from "../models/foodModel.js";
import fs from "fs"
import redisClient from "../server.js";
// add food Item

const addFood = async(req,res) => {
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try {
        await food.save();
        res.status(201).json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const listFood = async(req,res) => {
    const cacheKey = 'allFoods';
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json({ success: true, data: JSON.parse(cachedData) });
        }
        const foods = await foodModel.find({});
        await redisClient.set(cacheKey, JSON.stringify(foods), {
            EX: 3600
        });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

const removeFood = async(req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"});
    }
}


export {addFood,listFood,removeFood}