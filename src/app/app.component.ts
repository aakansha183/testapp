import { Component, NgModule } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import * as LiveUpdates from '@capacitor/live-updates';
import { App } from '@capacitor/app';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,CommonModule],
})
export class AppComponent implements OnInit {
  constructor() {}
  ngOnInit() {
    this.initializeApp();
  }
 async initializeApp(): Promise<void> {
  const SHOULD_RELOAD_KEY = 'shouldReloadApp';

  const checkForUpdates = async (): Promise<void> => {
    try {
      const result = await LiveUpdates.sync();

      // Store flag as string because localStorage stores strings
      localStorage.setItem(
        SHOULD_RELOAD_KEY,
        String(result.activeApplicationPathChanged)
      );

      if (result.activeApplicationPathChanged) {
        await LiveUpdates.reload();
      }
    } catch (error) {
      console.error('Live update failed:', error);
    }
  };

  // When app resumes from background
  App.addListener('resume', async () => {
    const shouldReload =
      localStorage.getItem(SHOULD_RELOAD_KEY) === 'true';

    if (shouldReload) {
      await LiveUpdates.reload();
    } else {
      await checkForUpdates();
    }
  });

  // Initial app load
  await checkForUpdates();
}
}
