import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableWindow } from './draggable-window';

describe('DraggableWindow', () => {
  let component: DraggableWindow;
  let fixture: ComponentFixture<DraggableWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggableWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
