import { Injectable, TemplateRef  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];
  gardens = [];

  // Push new Toasts to array with content and options.
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  // Callback method to remove Toast DOM element from view.
  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  update(gardens: Array<any>) {
    for (let garden of gardens) {
      if (garden.temperature < 12 || garden.tank < 75) {
        if (this.gardens.indexOf(garden._id) == -1) {
          this.gardens.push(garden._id);
          this.show(`Rasadnik "${garden.name}" zahteva održavanje.`, { classname: 'bg-danger text-light', autohide: false, headertext: 'UPOZORENjE!' });
        }
      } else {
        let index = this.gardens.indexOf(garden._id)
        if (index != -1) {
          this.remove(this.toasts[index]);
          this.gardens.splice(index, 1);
        }
      }
    }
  }

}
