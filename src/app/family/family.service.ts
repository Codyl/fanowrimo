import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
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
  getFamily(name: string, code: string) {
    const familyData: Family = {
      name: name,
      code: code,
      members: [this.authService.getUserId()],
    };
    return this.http.post<{
      name: string,
      id: string
    }>('http://localhost:3000/api/families/request/',familyData);
  }

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

  addMember(familyData) {
    if (!familyData.members.includes(this.authService.getUserId()))
      this.http
        .put('http://localhost:3000/api/families/' + familyData.familyId, {
          user: this.authService.getUserId(),
          family: familyData,
        })
        .subscribe((response) => {
          // this.router.navigate(['/books']);
        });
  }
}
