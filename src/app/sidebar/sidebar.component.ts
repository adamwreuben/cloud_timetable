import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  switchLayoutType: 'home' | 'review' | 'ue' | 'collision'|'files'|'overview'|'stuff' = 'review';
  onlineStatus: any;
  status;

  constructor() { }

  ngOnInit(): void {
  }

  changeLayoutDesign(status) {
    this.switchLayoutType = status;
  }

}
