import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideOAuthClient} from "angular-oauth2-oidc";
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideOAuthClient(),
        provideAnimationsAsync()]
};
