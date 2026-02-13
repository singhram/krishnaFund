import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const myInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Backend returned an unsuccessful response code
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        // Example: Handle specific status codes
        if (error.status === 401) {
          console.error('Unauthorized! Redirecting to login...');
          // Add logic to logout or redirect
        }
      }

      console.error(errorMessage);
      alert(error?.error?.message || 'An unexpected error occurred. Please try again later.');
      // Return the error so the component can also handle it if needed
      return throwError(() => new Error(errorMessage));
    })
  );
};
