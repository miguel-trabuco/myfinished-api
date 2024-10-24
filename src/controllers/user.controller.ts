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
			return response.status(400).json({ 
				message: responseMessages.MISSING_PARAMETERS(['name', 'email', 'password']) 
			});
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

		const id: string = uuid();
		try {
			await UserModel.create({
				id,
				name,
				email,
				passwordHash
			});
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: responseMessages.SERVER_ERROR });
		}

		const token: string = jwt.sign({id}, SECRET);
		response.set('authorization', `Bearer ${token}`);
		return response.status(201).json({ message: responseMessages.USER_CREATED });
	}

	public static async updateUser(request: Request, response: Response): Promise<Response> {
		const { 
			name,
			email,
			oldPassword,
			newPassword,
			id
		}: IUpdateUserRequest = request.body;

		if (!name && !email && !newPassword) {
			return response.status(400).json({ message: 'Missed paramters' });
		}

		if (name) {
			try {
				await UserModel.updateOne({id}, {name});
			} catch (error) {
				console.error(error);
				return response.status(500).json({ message: 'Internal server error' });
			}
		}

		if (email) {
			try {
				await UserModel.updateOne({id}, {email});
			} catch (error) {
				console.error(error);
				return response.status(500).json({ message: 'Internal server error' });
			}
		}

		if (newPassword) {
			if (!oldPassword) {
				return response.status(401).json({ message: 'Password is required' });
			}

			let userDocument: IUser | null;
			try {
				userDocument = await UserModel.findOne({id});

				if (userDocument === null) {
					return response.status(404).json({ message: 'User not found' });
				}

			} catch (error) {
				console.error(error);
				return response.status(500).json({ message: 'Internal server error' });
			}

			const isPasswordMatch: boolean = await bcrypt.compare(oldPassword, userDocument.passwordHash);

			if (isPasswordMatch === false) {
				return response.status(401).json({ message: 'Wrong password' });
			}

			if (newPassword.length < 8 || newPassword.length > 500) {
				return response.status(400).json({ message: 'Password must be betwee 6 and 500 character' });
			}

			try {
				const passwordHash: string = await bcrypt.hash(newPassword, 10);
				await UserModel.updateOne({id}, {passwordHash});
			} catch (error) {
				console.error(error);
				return response.status(500).json({ message: 'Internal server error' });
			}
		}

		return response.status(200).json({ message: 'User updated' });
	}

	public static async getUser(request: Request, response: Response): Promise<Response> {
		const id: string = request.body.id;

		let userDocument: IUser | null;
		try {
			userDocument = await UserModel.findOne({id});
			
			if (userDocument === null) {
				return response.status(404).json({ message: 'User not found' });
			}
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: 'Internal server error' });
		}

		return response.status(200).json({
			name: userDocument.name,
			email: userDocument.email
		});
	}

	public static async deleteUser(request: Request, response: Response): Promise<Response> {
		const id: string = request.body.id;

		try {
			await UserModel.deleteOne({id});
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: 'Internal server error' });
		}
		
		return response.status(200).json({ message: 'Deleted user' });
	}

	public static async login(request: Request, response: Response) {
		const { email, password }: { email: string, password: string } = request.body;

		if (!email || !password) {
			return response.status(400).json({ message: 'Email and password are required' });
		}

		let userDocument: IUser | null;
		try {
			userDocument = await UserModel.findOne({ email });
			
			if (userDocument === null) {
				return response.status(400).json({ message: 'Wrong email' });
			}
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: 'Internal server error' });
		}

		const isMatch: boolean = await bcrypt.compare(password, userDocument.passwordHash);

		if (!isMatch) {
			return response.status(401).json({ message: 'Wrong password' });
		}

		const SECRET: string | undefined = process.env.SECRET;
		if (SECRET === undefined) {
			console.log('Secret undefined');
			return response.status(500).json({ message: 'Internal server error' });
		}

		const id: string = userDocument.id;
		const token: string = jwt.sign({id}, SECRET);
		response.set('authorization', `Bearer ${token}`);
		return response.status(201).json({ message: 'Logged' });
	}
}

