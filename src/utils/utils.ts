import { randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { APP_SECRET, CLIENT_ORIGIN, PASSWORD_RESET_BYTES } from '../config';

//export default class UserUtils  {

export const signVerificationUrl = (url: string) =>
  createHmac('sha256', APP_SECRET as string)
    .update(String(url))
    .digest('hex');

export const hasValidVerificationUrl = function <UserDocument>(
  _id: string,
  _token: string,
  _expires: string,
  _signature: string,
) {
  const url = `${CLIENT_ORIGIN}/email/verify/${_id}/${_token}/${_expires}`;
  //const original = url.slice(0, url.lastIndexOf('&'))
  const signature = this.signVerificationUrl(url);
  return timingSafeEqual(Buffer.from(signature), Buffer.from(_signature)) && +_expires > Date.now();
};
export const plaintextToken = () => {
  return randomBytes(Number(String(PASSWORD_RESET_BYTES))).toString('hex');
};

export const hashedToken = (plaintextToken: string) => {
  return createHmac('sha256', APP_SECRET as string)
    .update(String(plaintextToken))
    .digest('hex');
};
//}
