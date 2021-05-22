import {InjectionToken, Provider} from '@angular/core';

export const ROTATION_INTERVAL_TOKEN = new InjectionToken<number>('rotation interval');

export function configureRotationIntervalProvider(rotationIntervalInMs = 2000): Provider {
  return { provide: ROTATION_INTERVAL_TOKEN, useValue: rotationIntervalInMs };
}
