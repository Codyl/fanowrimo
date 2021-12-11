import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Post } from '../posts/post.model';
import { Family } from './family.model';
import { FamilyService } from './family.service';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css'],
})
export class FamilyComponent implements OnInit {
  selectedValue = 'join';
  familyName;
  family: Family;
  families: Family[];
  familiesBooks: Post[]
  constructor(
    private familyService: FamilyService,
    private authService: AuthService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //get the familys themselves 

      this.familyService
        .getFamilies(this.authService.getUserFamilies())
        .subscribe((familyData) => {
          console.log(
            JSON.parse(JSON.stringify(familyData)).families,
            'returned families'
          );
          const requestedFamilies = JSON.parse(
            JSON.stringify(familyData)
          ).families;
          this.families = requestedFamilies;
          // get the books and the creators of the books, show only the books written in current year.
          this.familyService
            .getBooks(this.families[0].members)
            .subscribe((posts) => {
              console.log(posts);
              this.familiesBooks = posts.books;
            });
        });
      // this.families = this.familyService.getFamilies(
      //   this.authService.getUserFamilies()
  }

  onCreateFamily(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // console.log('create', form);
    this.familyService.addFamily(form.value.familyName, form.value.code);
  }

  onJoinFamily(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.familyName = form.value.code;
    this.familyService
      .getFamily(form.value.familyName, form.value.code)
      .subscribe((familyData) => {
        console.log(familyData.id, 'posted Data');
        if (familyData) {
          //Adds a member to the selected family
          this.familyService.addMember(familyData);
          this.authService.addFamilyToUser(familyData).subscribe(families => {
            const data: {families: string[], message: string} = JSON.parse(JSON.stringify(families));
            console.log(data.families, "<= my families are")
            //update our families to have the newly joined family
            this.familyService
              .getFamilies(this.authService.getUserFamilies())
              .subscribe((familyData) => {
                console.log(
                  JSON.parse(JSON.stringify(familyData)).families,
                  'returned families'
                );
                const requestFamilies = JSON.parse(
                  JSON.stringify(familyData)
                ).families;
                this.families = requestFamilies;
              });
          })
        }
      });
  }

  onMethodChange(event) {
    this.selectedValue = event.value;
    // console.log(event.value);
  }
}
