import { getUserBySessionToken } from '../db/users';
import { NextFunction, Request, Response } from 'express'
import { get, merge } from 'lodash'

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params

        const sessionToken = req.cookies['APP-AUTH'];
        if (!sessionToken)
            return res.sendStatus(403)

        const user = await getUserBySessionToken(sessionToken)

        if (id !== user._id.toString())
            return res.sendStatus(403)
        
        next()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['APP-AUTH'];
        
        if(!sessionToken)
            return res.sendStatus(403)

        const existingUser = await getUserBySessionToken(sessionToken);
        
        if(!existingUser)
            return res.sendStatus(403)
        
        merge(req, { identity: existingUser });
        
        next()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}