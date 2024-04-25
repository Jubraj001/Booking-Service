const axios = require('axios');

const BookingRepository = require("../repository/booking-repository");
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightId = data.flightId;
      let FlightRequestPathURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
      const response = await axios.get(FlightRequestPathURL);
      const flightData = response.data.data;
      let priceOfFlight = flightData.price;
      if(data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError('Something went wrong in the Booking Service', 'Insufficient seats in the flight');
      }

      const totalCost = priceOfFlight * data.noOfSeats;
      const bookingPayload = { ...data, totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);
      await axios.patch(FlightRequestPathURL, { totalSeats: flightData.totalSeats - booking.noOfSeats });
      const finalBooking = this.bookingRepository.update(booking.id, { status: 'Booked' });
      return finalBooking;
    } catch (error) {
      if(error.name === 'RepositoryError' || error.name === 'ValidationError') {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
