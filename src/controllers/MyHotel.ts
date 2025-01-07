import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Hotel from "../models/Hotel";

const createHotel = async (req: Request, res: Response) => {
  try {
    const images = req.files as Express.Multer.File[];
    const userId = req.userId;

    const imageUrls = await uploadImagesToCloudinary(images);
    const newHotel = new Hotel(req.body);

    newHotel.imageUrls = imageUrls;
    newHotel.userId = userId;
    newHotel.lastUpdated = new Date();

    await newHotel.save();

    res.status(201).json(newHotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating hotel" });
  }
};

const fetchHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

const fetchHotelById = async (req: Request, res: Response) => {
  try {
    const { id: hotelId } = req.params;
    const hotel = await Hotel.findOne({ _id: hotelId, userId: req.userId });
    if (!hotel) {
      res.status(404).json({ message: "No hotel found" });
      return;
    }
    res.json(hotel);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

const updateHotel = async (req: Request, res: Response) => {
  try {
    const { id:hotelId } = req.params
    const images = req.files as Express.Multer.File[]

    const hotel = await Hotel.findById(hotelId)

    if(!hotel) {
      res.status(404).json({ message: 'No hotel found'})
      return
    }

    if(hotel.userId.toString() !== req.userId.toString()) {
      res.status(401).json({ message: 'Unauthorized'})
      return
    }

    const imageUrls = await uploadImagesToCloudinary(images)

    hotel.lastUpdated = new Date()
    hotel.imageUrls = [...imageUrls, ...(req.body.imageUrls || [])]

    // Fill other data
    hotel.name = req.body.name
    hotel.city = req.body.city
    hotel.country = req.body.country
    hotel.description = req.body.description
    hotel.type = req.body.type
    hotel.adultCount = req.body.adultCount
    hotel.childCount = req.body.childCount
    hotel.pricePerNight = req.body.pricePerNight
    hotel.starRating = req.body.starRating
    hotel.facilities = req.body.facilities

    await hotel.save()
    res.status(201).json(hotel)

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating hotel" });
  }
};

const uploadImagesToCloudinary = async (images: Express.Multer.File[]) => {
  const imagePromises = images.map(async (image) => {
    const base64String = Buffer.from(image.buffer).toString("base64");
    const base64Image = `data:${image.mimetype};base64,${base64String}`;
    const imageUrl = await cloudinary.v2.uploader.upload(base64Image);
    return imageUrl.url;
  });

  return await Promise.all(imagePromises);
};

export { createHotel, fetchHotels, fetchHotelById, updateHotel };
