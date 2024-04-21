import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if(environment.chargebee_site === 'analysts24x7-test'){
  const script = document.createElement('script');
    script.onload = () => {
      window["Chargebee"].init({
        "site": "analysts24x7-test"
      });
    };
    script.setAttribute('src', 'https://js.chargebee.com/v2/chargebee.js');
    document.body.appendChild(script);
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
