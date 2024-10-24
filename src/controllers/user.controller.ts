import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { UserModel } from '../database/models/index';
import { responseMessages } from '../util/responseMessages';
import type { Request, Response } from 'express';
import type { User } from '../interfaces/index';

export class UserController {
	public static async createUser(request: Request, response: Response): Promise<Response> {
		const { name, email, password } = request.body;

		if (!name || !email || !password) {
			return response.status(400).json({ message: responseMessages.MISSING_PARAMETERS });
		} 

		try {
			const userExist: User | null = await UserModel.findOne({email});
			if (userExist) {
				return response.status(400).json({ message: responseMessages.EMAIL_USED });
			} 

		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}

		if (password.length < 8 || password.length > 500) {
			return response.status(400).json({ message: responseMessages.PASSWORD_LENGTH });
		} 

		const SECRET = process.env.SECRET;
		if (!SECRET) {
			console.log('Secret undefined');
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}
		
		const passwordHash: string = await bcrypt.hash(password, 10);

		const userID = uuid();
		try {
			await UserModel.create({
				userID,
				name,
				email,
				passwordHash
			});
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}

		const token = jwt.sign({userID}, SECRET);
		response.set('authorization', `Bearer ${token}`);
		return response.status(201).json({ message: responseMessages.USER_CREATED });
	}

	public static async updateUser(request: Request, response: Response): Promise<Response> {
		const { name, email, oldPassword, newPassword, userID } = request.body;

		if (!name && !email && !newPassword) {
			return response.status(400).json({
				message: responseMessages.MISSING_PARAMETERS});
		}

		try {

			const userDocument: User | null = await UserModel.findOne({userID});

			if (!userDocument) {
				return response.status(404).json({
					message: responseMessages.USER_NOT_FOUND
				});
			}

			if (name) userDocument.name = name;
			if (email) userDocument.email = email;
			if (newPassword) {
				if (!oldPassword) {
					return response.status(400).json({
						message: responseMessages.MISSING_PARAMETERS
					});
				}

				if (!await bcrypt.compare(oldPassword, userDocument.passwordHash)) {
					return response.status(400).json({
						message: responseMessages.WRONG_PASSWORD
					});
				}

				if (newPassword.length < 8 || newPassword.length > 500) {
					return response.status(400).json({
						message: responseMessages.PASSWORD_LENGTH
					});
				}

				userDocument.passwordHash = await bcrypt.hash(newPassword, 10);
			}

			await userDocument.save();
			
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}

		return response.status(200).json({ message: responseMessages.USER_UPDATED });
	}

	public static async getUser(request: Request, response: Response): Promise<Response> {
		const userID = request.body.userID;

		let userDocument: User | null;

		try {
			userDocument = await UserModel.findOne({userID});
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}

		if (!userDocument) {
			return response.status(404).json({ message: responseMessages.USER_NOT_FOUND });
		}

		return response.status(200).json({
			name: userDocument.name,
			email: userDocument.email
		});
	}

	public static async deleteUser(request: Request, response: Response): Promise<Response> {
		const userID = request.body.userID;

		try {
			await UserModel.deleteOne({userID});
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}
		
		return response.status(200).json({ message: responseMessages.USER_DELETED });
	}

	public static async login(request: Request, response: Response) {
		const { email, password } = request.body;

		if (!email || !password) {
			return response.status(400).json({ message: responseMessages.MISSING_PARAMETERS });
		}

		let userDocument: User | null;

		try {
			userDocument = await UserModel.findOne({ email });
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}

		if (!userDocument) {
			return response.status(400).json({ message: responseMessages.WRONG_EMAIL });
		}

		if (!await bcrypt.compare(password, userDocument.passwordHash)) {
			return response.status(401).json({ message: responseMessages.WRONG_PASSWORD });
		}

		const SECRET = process.env.SECRET;
		if (!SECRET) {
			console.log('Secret undefined');
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}

		const token = jwt.sign({userID: userDocument.userID}, SECRET);
		response.set('authorization', `Bearer ${token}`);
		return response.status(201).json({ message: responseMessages.LOGGED });
	}
}

