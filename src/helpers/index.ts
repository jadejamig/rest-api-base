import crypto from 'crypto';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    const hmac = crypto.createHmac('sha256', [salt, password].join('/')).update(process.env.SECRET).digest('hex');
    return hmac
};


