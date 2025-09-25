import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Minecraft } from './minecraft';

describe('Browser', () => {
  let component: Minecraft;
  let fixture: ComponentFixture<Minecraft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minecraft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Minecraft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
