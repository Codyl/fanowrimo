import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Post } from '../posts/post.model';
import { PostService } from '../posts/posts.service';
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
  familiesBooks: Post[];
  namesInFamily;
  familyCodes: string[] = [];
  constructor(
    private familyService: FamilyService,
    private authService: AuthService,
    private postService: PostService,
    public route: ActivatedRoute
  ) {}
//TODO Set the userFamilies in auth.service to allow the getFamilies method to work
  ngOnInit(): void {
    //get the familys themselves
    this.familyService
      .getFamilies(this.authService.getUserFamilies())
      .subscribe((familyData) => {
        for (let family of JSON.parse(JSON.stringify(familyData)).families) {
          this.familyCodes.push(family.code);
        }
        const requestedFamilies = JSON.parse(
          JSON.stringify(familyData)
        ).families;
        this.families = requestedFamilies;
        // get the books and the creators of the books, show only the books written in current year.
        if (this.families[0]) {
          this.familyService
            .getBooks(this.families[0].members)
            .subscribe((posts) => {
              this.familiesBooks = posts.books;
            });
        } else {
          // console.log('none');
        }
      });
    //Get the names of the book creators in the family
    this.familyService.getNamesOfBookCreators().subscribe((names) => {
      const data = [JSON.parse(JSON.stringify(names))];
      this.namesInFamily = data.map((name) => name.names);
    });
  }

  onCreateFamily(form: NgForm) {
    if (form.invalid) {
      return;
    }
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
        if (familyData) {
          //Adds a member to the selected family
          this.familyService.addMember(familyData);
          this.authService.addFamilyToUser(familyData).subscribe((families) => {
            const data: { families: string[]; message: string } = JSON.parse(
              JSON.stringify(families)
            );
            localStorage.setItem('userFamilies', JSON.stringify(data.families));
            //update our families to have the newly joined family
            this.familyService
              .getFamilies(this.authService.getUserFamilies())
              .subscribe((familyData) => {

                const requestFamilies = JSON.parse(
                  JSON.stringify(familyData)
                ).families;
                this.families = requestFamilies;
              });
          });
        }
      });
  }

  onMethodChange(event) {
    this.selectedValue = event.value;
  }

  getCreatorName(book) {
    return this.namesInFamily[0].filter((name) => book.creator === name.id)[0]
      .username;
  }

  getJoinCode(i: number) {
    const elem = document.getElementById(i.toString());
    if (elem.innerText !== this.familyCodes[i]) {
      elem.innerText = this.familyCodes[i];
    } else {
      elem.innerText = '';
    }
  }
}
