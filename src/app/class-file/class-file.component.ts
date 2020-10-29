import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-class-file',
  templateUrl: './class-file.component.html',
  styleUrls: ['./class-file.component.css']
})
export class ClassFileComponent implements OnInit {

  selectedSubject = 'DS 133';

  constructor() { }

  ngOnInit(): void {
  }

}
