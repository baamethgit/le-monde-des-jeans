/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import './polyfills';


bootstrapApplication(AppComponent, appConfig)
// .then(ref => {
//     // Ensure Angular destroys itself on hot reloads.
//     if (window['ngRef']) {
//       window['ngRef'].destroy();
//     }
//     window['ngRef'] = ref;

//     // Otherwise, log the boot error
//   })
  .catch((err) => console.error(err));