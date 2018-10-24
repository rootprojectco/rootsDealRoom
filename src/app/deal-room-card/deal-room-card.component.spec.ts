import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealRoomCardComponent } from './deal-room-card.component';

describe('DealRoomCardComponent', () => {
  let component: DealRoomCardComponent;
  let fixture: ComponentFixture<DealRoomCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealRoomCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealRoomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
