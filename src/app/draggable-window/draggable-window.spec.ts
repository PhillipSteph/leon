import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableWindowComponent } from './draggable-window';

describe('DraggableWindowComponent', () => {
  let component: DraggableWindowComponent;
  let fixture: ComponentFixture<DraggableWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggableWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
