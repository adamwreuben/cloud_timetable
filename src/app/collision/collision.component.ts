import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collision',
  templateUrl: './collision.component.html',
  styleUrls: ['./collision.component.css']
})
export class CollisionComponent implements OnInit {

  selectedCourse: any = 'Computer Science';
  selectedSubject: any = 'MT 100';
  
  constructor() { }

  ngOnInit(): void {
  }

}
