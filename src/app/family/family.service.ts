import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Family } from './family.model';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
  getFamily() {}

  addFamily(familyName: string, code: string) {
    const familyData: Family = {
      name: familyName,
      code: code,
      members: [this.authService.getUserId()],
    };
    this.http
      .post<{ message: string; family: Family }>(
        'http://localhost:3000/api/families/',
        familyData
      )
      .subscribe((responseData) => {
        // this.router.navigate(['/']);
      });
  }
}
