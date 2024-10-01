import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export default function verifyTokenMiddleware(request: Request, response: Response, next: NextFunction): Response | void {
	const bearerToken: string | undefined = request.headers['authorization'];

	if (bearerToken === undefined) {
		return response.status(401).json({ message: 'Unauthorized' });
	}

	const token: string = bearerToken && bearerToken.split(' ')[1];

	const SECRET: string | undefined = process.env.SECRET;

	if (SECRET === undefined) {
		return response.status(500).json({ message: 'Internal server error' });
	}

	try {
		const id = (jwt.verify(token, SECRET) as JwtPayload).id as string;
		request.body.id = id;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return response.status(401).json({ message: 'Unauthorized' });
	}

	return next();
};
