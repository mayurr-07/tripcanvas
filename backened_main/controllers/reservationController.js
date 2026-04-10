import Reservation from "../models/Reservation.js";

export const createReservation = async (req, res) => {

  try {

    const { trip, tripId, type, title, date, notes } = req.body;

    const reservation = await Reservation.create({
      trip: trip || tripId,
      type,
      title,
      date,
      notes
    });

    res.status(201).json(reservation);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

export const getReservations = async (req, res) => {

  try {

    const reservations = await Reservation.find({
      trip: req.params.tripId
    });

    res.json(reservations);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};