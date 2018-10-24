import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealRoomDetailsComponent } from './deal-room-details.component';

describe('DealRoomDetailsComponent', () => {
  let component: DealRoomDetailsComponent;
  let fixture: ComponentFixture<DealRoomDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealRoomDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
