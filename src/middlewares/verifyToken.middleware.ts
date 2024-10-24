import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { responseMessages } from '../util/responseMessages';

export function verifyTokenMiddleware(request: Request, response: Response, next: NextFunction): Response | void {
	const bearerToken = request.headers['authorization'];

	if (!bearerToken) {
		return response.status(401).json({ message: responseMessages.UNAUTHORIZED });
	}

	const token = bearerToken && bearerToken.split(' ')[1];

	const SECRET = process.env.SECRET;

	if (!SECRET) {
		return response.status(500).json({ message: responseMessages.SERVER_ERROR });
	}

	try {
		request.body.userID = (jwt.verify(token, SECRET) as JwtPayload).id as string;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return response.status(401).json({ message: responseMessages.UNAUTHORIZED });
	}

	return next();
};
