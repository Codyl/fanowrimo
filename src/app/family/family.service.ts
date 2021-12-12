import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { AuthService } from '../auth/auth.service';
import { Family } from './family.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/families';

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
    }>(BACKEND_URL+'/request/',familyData);
  }

  addFamily(familyName: string, code: string) {
    const familyData: Family = {
      name: familyName,
      code: code,
      members: [this.authService.getUserId()],
    };
    this.http
      .post<{ message: string; family: Family }>(BACKEND_URL, familyData)
      .subscribe((responseData) => {
        // this.router.navigate(['/']);
      });
  }

  addMember(familyData) {
    if (!familyData.members.includes(this.authService.getUserId()))
      this.http
        .put(BACKEND_URL +'/'+ familyData.familyId, {
          user: this.authService.getUserId(),
          family: familyData,
        })
        .subscribe((response) => {
          // this.router.navigate(['/books']);
          // this.authService.setUserFamilies(res)
        });
  }

  getFamilies(familyIds: string[]) {
    return this.http.post(BACKEND_URL+'/myFamilies', { ids: familyIds })
  }
  
  getBooks(memberIds: string[]) {
    return this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        environment.apiUrl + '/posts'
      )
      .pipe(
        map((postData) => {
          const date = new Date();
          return {
            books: postData.posts.filter((post) =>
              memberIds.includes(post.creator) &&
              post.yearWritten === date.getFullYear() &&
              post.creator !== this.authService.getUserId()),
          };
        })
      );
      
  }

  getNamesOfBookCreators() {
    return this.http.get(environment.apiUrl + '/user/names');
  }
}
