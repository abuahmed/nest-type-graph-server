// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from '../../config';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const req = context.switchToHttp().getRequest();
//     return validateRequest(req);
//   }
// }
// function validateRequest(req: any): boolean | Promise<boolean> | Observable<boolean> {
//   let token: string;
//   console.log(req);
//   // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//   //   try {
//   //     token = req.headers.authorization.split(' ')[1];

//   //     const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

//   //     //   req.user = await User.findById(decoded.id).select('-password');
//   //     if (decoded) return true;
//   //   } catch (error) {
//   //     return false;
//   //   }
//   // }
//   return true;
// }
