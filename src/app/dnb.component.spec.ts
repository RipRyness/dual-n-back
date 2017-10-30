import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnbComponent } from './dnb.component';

describe('DnbComponent', () => {
  let component: DnbComponent;
  let fixture: ComponentFixture<DnbComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DnbComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DnbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
