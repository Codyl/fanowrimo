import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FamilyService } from './family.service';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css'],
})
export class FamilyComponent implements OnInit {
  selectedValue;
  constructor(private familyService: FamilyService) {}

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
    console.log('join', form);
    //if this family name exists
    //if the name and code are correct
    // Add this member to the family
    // this.familyService.updateFamily(form.va)
  }

  onMethodChange(event) {
    this.selectedValue = event.value;
    console.log(event.value);
  }
}
