import { Request, Response } from "express";
import cloudinary from 'cloudinary'
import Hotel from "../models/Hotel";

const createHotel = async (req: Request, res: Response) => {
  try {
    const images = req.files as Express.Multer.File[]
    const userId = req.userId

    const imagePromises = images.map(async(image) => {
       const base64String = Buffer.from(image.buffer).toString('base64') 
       const base64Image = `data:${image.mimetype};base64,${base64String}`
       const imageUrl = await cloudinary.v2.uploader.upload(base64Image)
       return imageUrl.url
    })

    const imageUrls = await Promise.all(imagePromises)
    const newHotel = new Hotel(req.body)

    newHotel.imageUrls = imageUrls
    newHotel.userId = userId
    newHotel.lastUpdated = new Date()
    
    await newHotel.save()

    res.status(201).json(newHotel)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating hotel'})
  }
}

export {createHotel}