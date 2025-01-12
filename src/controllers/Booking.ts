import { Request, Response } from "express";
import Hotel from "../models/Hotel";

const fetchBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const hotels = await Hotel.find({
      bookings: {
        $elemMatch: { userId },
      },
    });

    const myBookings = hotels.map((hotel) => {
      const bookings = hotel.bookings.filter(
        (booking) => booking.userId === userId
      );

      const myBooking = {
        ...hotel.toObject(),
        bookings: bookings,
      };
      return myBooking;
    });

    res.status(200).send(myBookings)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export { fetchBookings };
