import { authentication, random } from '../helpers';
import { createUser, getUserByEmail } from '../db/users';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.sendStatus(400)

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user)
            return res.sendStatus(400)

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash)
            return res.sendStatus(403);
        
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('APP-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' })
        
        return res.status(200).json(user);

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username)
            return res.sendStatus(400)

        const existingUser = await getUserByEmail(email);

        if (existingUser)
            return res.sendStatus(400)
        
        const salt = random();

        const user = await createUser({
            email: email,
            username: username,
            authentication: {
                salt: salt,
                password: authentication(salt, password)
            }
        });

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}