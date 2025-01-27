import { Request, Response } from "express";
import Hotel from "../models/Hotel";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const searchHotels = async (req: Request, res: Response) => {
  try {
    const destination = req.query.destination as string;
    const adultCount = parseInt(req.query.adultCount as string) || 1;
    const childCount = parseInt(req.query.childCount as string) || 1;
    const price = req.query.price ? parseInt(req.query.price as string) : null;
    const stars = req.query.stars as string;
    const types = req.query.types as string;
    const facilities = req.query.facilities as string;
    const sortOptions = req.query.sortOptions as string;
    const pageNumber = parseInt(req.query.page as string) || 1;

    let sortBy = {};

    let query: any = {};

    if (destination) {
      query["$or"] = [
        { city: new RegExp(destination, "i") },
        { country: new RegExp(destination, "i") },
      ];
    }

    query["adultCount"] = { $gte: adultCount };
    query["childCount"] = { $gte: childCount };

    if (stars) {
      const starsArray = stars.split(",").map((star) => parseInt(star));
      query["starRating"] = { $in: starsArray };
    }

    if (types) {
      query["type"] = { $in: types.split(",") };
    }

    if (facilities) {
      query["facilities"] = { $all: facilities.split(",") };
    }

    if (price) {
      query["pricePerNight"] = { $lte: price };
    }

    if (sortOptions) {
      switch (sortOptions) {
        case "starRating":
          sortBy = { starRating: 1 };
          break;
        case "pricePerNightAsc":
          console.log("pricePerNightAsc");
          sortBy = { pricePerNight: 1 };
          break;
        case "pricePerNightDsc":
          sortBy = { pricePerNight: -1 };
          break;
      }
    }

    const pageSize = 5;
    const skipDocs = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortBy)
      .skip(skipDocs)
      .limit(pageSize);
    const total = await Hotel.countDocuments(query);

    const response = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: "Error searching hotels" });
  }
};

const fetchHotel = async (req: Request, res: Response) => {
  try {
    const hotelId = req.params.id as string;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hotel" });
  }
};

const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const hotelId = req.params.hotelId,
      userId = req.userId;
    const { totalNights } = req.body;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }

    const totalCost = totalNights * hotel.pricePerNight;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost,
      currency: "USD",
      metadata: {
        hotelId,
        userId,
      },
    });

    if (!paymentIntent.client_secret) {
      res.status(500).json({ message: "Error creating payment intent" });
      return;
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      totalCost,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Error creating payment intent" });
  }
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const hotelId = req.params.hotelId;
    const paymentIntentId = req.body.paymentIntentId;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
      res.status(400).json({ message: "Payment intent not found" });
      return;
    }

    if (
      paymentIntent.metadata.hotelId !== hotelId ||
      paymentIntent.metadata.userId !== req.userId
    ) {
      res.status(400).json({ message: "Payment intent mismatched" });
      return;
    }

    if (paymentIntent.status != "succeeded") {
      res
        .status(400)
        .json({
          message: `Payment intent not succeded, status: ${paymentIntent.status}`,
        });
      return;
    }

    const bookingData = { ...req.body, userId: req.userId };
    const hotel = await Hotel.findByIdAndUpdate(hotelId, {
      $push: { bookings: bookingData },
    });

    if(!hotel) {
      res.status(404).json({message: 'Hote not found'})
      return
    }
    
    //await hotel.save()
    res.status(200).send()

  } catch (err) {
    res.status(500).json({ message: "Error creating booking" });
  }
};
export { searchHotels, fetchHotel, createPaymentIntent, createBooking };
