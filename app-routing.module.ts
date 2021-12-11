import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent } from 'src/app/posts/post-list/post-list.component';
import { PostCreateComponent } from 'src/app/posts/post-create/post-create.component';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { SignupComponent } from 'src/app/auth/signup/signup.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { HomeComponent } from 'src/app/home/home.component';
import { FamilyComponent } from 'src/app/family/family.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'books', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'family', component: FamilyComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'family/:familyId',
    component: FamilyComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
