import UserModel from '../database/models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import type { Request, Response } from 'express';
import { IUser } from '../interfaces/IUser';


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
}
