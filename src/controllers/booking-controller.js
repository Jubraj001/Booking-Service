const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

class BookingController {
  constructor() {
  }

  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const payload = {
      data: {
        subject: 'This is a notif from queue',
        content: 'Some queue will subscribe to this',
        recipientEmail: 'jubrajdev003@gmail.com',
        notificationTime: '2023-01-08T09:49:00'
      },
      service: 'CREATE_TICKET'
    }
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    return res.status(200).json({
      message: 'Successfully published the event'
    });
  }

  async create(req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
      return res.status(StatusCodes.OK).json({
        message: 'Successfully completed booking',
        success: true,
        err: {},
        data: response
      })
    } catch (error) {
      return res.status(error.statusCode).json({
        message: error.message ,
        success: false,
        err: error.explanation,
        data: {}
      })
    }
  }
}

module.exports = BookingController;
