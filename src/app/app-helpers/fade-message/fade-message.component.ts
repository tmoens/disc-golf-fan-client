import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'tsw-fade-message',
  standalone: true,
  templateUrl: './fade-message.component.html',
  styleUrls: ['./fade-message.component.scss']
})
export class FadeMessageComponent implements OnChanges {

  @Input() message: string = '';
  @Input() duration: number = 5000;
  @Input() fadeDuration: number = 600;

  visible = true;
  fading = false;

  ngOnChanges() {
    // Reset state when message changes
    this.visible = true;
    this.fading = false;

    setTimeout(() => {
      this.fading = true;

      setTimeout(() => {
        this.visible = false;
      }, this.fadeDuration);

    }, this.duration);
  }
}
