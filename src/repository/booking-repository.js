const { StatusCodes } = require("http-status-codes");
const { ValidationError, AppError } = require("../utils/errors/index");

class BookingRepository {
  async create(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      if(error.name === 'SequelizeValidationError') {
        throw new ValidationError(error);
      }
      throw new AppError(
        'Repository Error',
        'Cannot create booking',
        'There was some issue creating the booking, please try again later',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async update(data) {
    
  }
}

module.exports = BookingRepository;
