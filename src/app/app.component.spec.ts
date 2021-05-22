import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {MockBuilder, MockRender} from 'ng-mocks';
import {AppModule} from './app.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    return MockBuilder(AppComponent, AppModule);
  });

  it('should create the app', () => {
    const fixture = MockRender(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'reactiveTable'`, () => {
    const fixture = MockRender(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('app-reactive');
  });

  xit('should render title', () => {
    const fixture = MockRender(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('reactiveTable app is running!');
  });
});
