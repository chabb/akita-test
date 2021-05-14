import {InjectionToken, Provider} from '@angular/core';

export const DUMMY_CONFIG = new InjectionToken<string>('For demo purposes');

const provide = DUMMY_CONFIG;

export const configureConfigProvider: (v: string) => Provider = (useValue: string) => ({
  provide,
  useValue,
});
