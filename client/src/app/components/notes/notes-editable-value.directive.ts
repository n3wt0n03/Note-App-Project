import {
    Directive,
    ElementRef,
    HostListener,
    forwardRef,
    Renderer2,
  } from '@angular/core';
  import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
  
  @Directive({
    selector: '[notesEditableValue]',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NotesEditableValueDirective),
        multi: true,
      },
    ],
  })
  export class NotesEditableValueDirective implements ControlValueAccessor {
    private onChange: (value: any) => void = () => {};
    private onTouched: () => void = () => {};
  
    constructor(private el: ElementRef, private renderer: Renderer2) {}
  
    writeValue(value: any): void {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', value || '');
    }
  
    registerOnChange(fn: (value: any) => void): void {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
    }
  
    @HostListener('input', ['$event.target'])
    onInput(target: HTMLElement): void {
      const value = target.innerHTML;
      this.onChange(value);
    }
  
    @HostListener('blur')
    onBlur(): void {
      this.onTouched();
    }
  }
  