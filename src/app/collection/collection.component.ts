import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent {
  constructor(private router: Router) {}

  // Sample data - replace with your actual image data
  images: any[] = [
    { id: 1, name: 'GeneticApex', url: 'https://img.game8.co/4031090/189603ca4a2894992888830b8a6510e7.png/show' },
    { id: 2, name: 'MythicIsland', url: 'https://img.game8.co/4068968/1689e7f6bc92e15eaf19fed8f2db2c40.png/show' },
    { id: 3, name: 'SpaceTimeSmackdown', url: 'https://img.game8.co/4088311/6cae28555479fcaed67222c96a895e14.png/show' },
    { id: 4, name: 'PromoPack', url: 'https://img.game8.co/4000515/749fbf5d162e0f7801b9b06554133949.png/show' },
  ];

  navigateTo(imageId: number) {
    // Navigate to the appropriate component based on the image ID
    switch(imageId) {
      case 1:
        this.router.navigate(['/apexGen']);
        break;
      case 2:
        this.router.navigate(['/mythicalIsland']);
        break;
      case 3:
        this.router.navigate(['/spaceTime']);
        break;
      case 4:
        this.router.navigate(['/promoCards']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }
}