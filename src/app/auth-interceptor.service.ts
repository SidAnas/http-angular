import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any>{
    console.log('Request is on its way!');
    const modifiedRequest = req.clone({
      headers: req.headers.append('Sid', 'Anas'),
      // params: req.params.append('auth', 'xyz')
      responseType: 'json'
    });
    return next.handle(modifiedRequest).pipe(tap(event => {
      // console.log(event);
      if (event.type === HttpEventType.Response){
        // console.log(event.body);
      }
    }));
  }
}
