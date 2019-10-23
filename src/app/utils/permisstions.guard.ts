import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {ApiService} from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PermisstionsGuard implements CanActivate {
  constructor(
    private readonly api: ApiService,
    readonly router: Router
  ) {
  }

  /** Validates authentication for a specific route. */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.api.isAdmin$.getValue()) {
      this.router.navigate(['/tasks'], {queryParams: {returnUrl: state.url}});
      return false;
    } else {
      return true;
    }
  }
}
