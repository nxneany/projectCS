import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminLoadingService } from '../service/admin-loading.service';

export const adminLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const adminLoading = inject(AdminLoadingService);
  const isAdminPage = router.url.split('?')[0].startsWith('/admin');

  if (!isAdminPage) {
    return next(req);
  }

  adminLoading.show();

  return next(req).pipe(finalize(() => adminLoading.hide()));
};
