import {Component, Input} from '@angular/core';
import {Circle} from '../../models/circle';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-circle-in-list',
  templateUrl: './circle-in-list.component.html',
  styleUrls: ['./circle-in-list.component.scss']
})
export class CircleInListComponent {

  // Модель круга в списке
  @Input() circle: Circle = null;
  // Строка поиска получаем из списка
  @Input() searchTerm = '';

  constructor(
    public config: ConfigService
  ) {
  }

  public getLogoPhoto() {
    return this.config.getLogo(this.circle.productId ? this.circle.productId : this.circle.id);
  }

}
