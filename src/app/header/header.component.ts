import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ]
})

export class HeaderComponent implements OnInit {
  // @Output() saveTranslateData = new EventEmitter<boolean>(false);
  constructor() { }

  ngOnInit() {
  }
  onSaveData(){
    // this.saveTranslateData.emit(true);
    
  }

}
