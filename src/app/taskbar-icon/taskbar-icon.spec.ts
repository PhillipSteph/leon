import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskbarIcon } from './taskbar-icon';

describe('TaskbarIcon', () => {
  let component: TaskbarIcon;
  let fixture: ComponentFixture<TaskbarIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskbarIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskbarIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
