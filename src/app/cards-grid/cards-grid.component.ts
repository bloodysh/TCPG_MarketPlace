import {Component, Input} from '@angular/core';
import {Card} from '@/types/Card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {Observable} from 'rxjs';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-cards-grid',
  imports: [
    MatGridList,
    MatGridTile,
    AsyncPipe,
    NgOptimizedImage
  ],
  templateUrl: './cards-grid.component.html',
  styleUrl: './cards-grid.component.css'
})
export class CardsGridComponent {
  @Input() cards$!: Observable<Card[]>;
}
