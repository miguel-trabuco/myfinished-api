import UserModel from '../database/models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import type { Request, Response } from 'express';
import type { IUser } from '../interfaces/IUser';
import type { IUpdateUserRequest } from '../interfaces/IUpdateUserRequest';


export class UserController {
	public static async createUser(request: Request, response: Response): Promise<Response> {
		const { name, email, password }: { name: string, email: string, password: string } = request.body;

		if (!name || !email || !password) {
			return response.status(400).json({ message: 'Name, email and password are required' });
		}

		try {
			const userExist: IUser | null = await UserModel.findOne({email});
			if (userExist) {
				return response.status(400).json({ message: 'Email already used' });
			}
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: 'Internal server error' });
		}

		if (password.length < 8 || password.length > 500) {
			return response.status(400).json({ message: 'Password must be betwee 6 and 500 character' });
		}

		const SECRET: string | undefined = process.env.SECRET;
		if (SECRET === undefined) {
			console.log('Secret undefined');
			return response.status(500).json({ message: 'Internal server error' });
		}

		const id: string = uuid();
		const token: string = jwt.sign(id, SECRET);
		const passwordHash: string = await bcrypt.hash(password, 10);

		try {
			await UserModel.create({
				id,
				name,
				email,
				passwordHash
			});
		} catch (error) {
			console.error(error);
			return response.status(500).json({ message: 'Internal server error' });
		}

		response.set('Authorization', `Bearer ${token}`);
		return response.status(201).json({ message: 'User created' });
	}

	public static async updateUser(request: Request,response: Response): Promise<Response> {
		const { 
			name,
			email,
			oldPassword,
			newPassword,
			id
		}: IUpdateUserRequest = request.body;

		if (!name && !email && !oldPassword && !newPassword && !id) {
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
				userDocument = await UserModel.findById(id);

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
}
