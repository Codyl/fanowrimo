import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth/auth.service';
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
  constructor(
    private familyService: FamilyService,
    private authService: AuthService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onCreateFamily(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('create', form);
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
        console.log(familyData, 'postedData');
        if (familyData) {
          //Adds a member to the selected family
          this.familyService.addMember(familyData);
          this.authService.addFamilyToUser(familyData.id)
        }
      });
  }

  onMethodChange(event) {
    this.selectedValue = event.value;
    console.log(event.value);
  }
}
