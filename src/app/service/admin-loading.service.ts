import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminLoadingService {
  private activeRequests = 0;
  private readonly loadingSubject = new BehaviorSubject(false);

  readonly loading$ = this.loadingSubject.asObservable();

  show() {
    this.activeRequests += 1;
    this.loadingSubject.next(true);
  }

  hide() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.loadingSubject.next(this.activeRequests > 0);
  }
}
