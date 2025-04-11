import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appObserveVisibility]'
})
export class ObserveVisibilityDirective {
  @Input('appObserveVisibility') useScale: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, 'opacity-100');
          this.renderer.addClass(this.el.nativeElement, 'translate-y-0');

          if (this.useScale) {
            this.renderer.removeClass(this.el.nativeElement, 'scale-75');
            this.renderer.addClass(this.el.nativeElement, 'scale-100');
          }
        } else {
          this.renderer.removeClass(this.el.nativeElement, 'opacity-100');
          this.renderer.addClass(this.el.nativeElement, 'opacity-0');
          this.renderer.addClass(this.el.nativeElement, 'translate-y-10');

          if (this.useScale) {
            this.renderer.removeClass(this.el.nativeElement, 'scale-100');
            this.renderer.addClass(this.el.nativeElement, 'scale-75');
          }
        }
      },
      { threshold: 0.3 }
    );

    this.renderer.addClass(this.el.nativeElement, 'opacity-0');
    this.renderer.addClass(this.el.nativeElement, 'translate-y-10');
    this.renderer.addClass(this.el.nativeElement, 'transition-all');
    this.renderer.addClass(this.el.nativeElement, 'duration-700');

    if (this.useScale) {
      this.renderer.addClass(this.el.nativeElement, 'scale-75');
    }

    observer.observe(this.el.nativeElement);
  }
}
