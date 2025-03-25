import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, MatGridList, MatGridTile, RouterLink],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent {
  images = [
    { id: 1, href: '/cards/A1', name: 'GeneticApex', url: 'https://img.game8.co/4031090/189603ca4a2894992888830b8a6510e7.png/show' },
    { id: 2, href: '/cards/A1a', name: 'MythicIsland', url: 'https://img.game8.co/4068968/1689e7f6bc92e15eaf19fed8f2db2c40.png/show' },
    { id: 3, href: '/cards/A2', name: 'SpaceTimeSmackdown', url: 'https://img.game8.co/4088311/6cae28555479fcaed67222c96a895e14.png/show' },
    { id: 4, href: '/cards/P-A', name: 'PromoPack', url: 'https://img.game8.co/4000515/749fbf5d162e0f7801b9b06554133949.png/show' },
  ] satisfies {id: number; href: string; name: string; url: string}[];
}
