import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now(); 

    res.on('finish', () => {
      const duration = Date.now() - start; 
      const { method, originalUrl } = req;
      const { statusCode } = res;

      
      console.log(`${method} ${originalUrl} ${statusCode} ${duration} ms`);
    });

    next();
  }
}
