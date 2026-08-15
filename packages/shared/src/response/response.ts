import { Response } from "express";

//* Success response middleware for Express */
//*successResponse.ts is a utility function that sends a standardized success response in JSON format. It takes the Express Response object, the data to be sent, and an optional status code (defaulting to 200). It ensures consistent response structure across the application.
export function successResponse(
  res: Response,
  data: unknown,
  statusCode: number = 200,
) {
  res.status(statusCode).json({
    success: true,
    data: data,
  });
}

//* Fail response middleware for Express */
export function failResponse(
  res: Response,
  message: string,
  statusCode: number = 400,
) {
  res.status(statusCode).json({
    success: false,
    message: message,
  });
}
