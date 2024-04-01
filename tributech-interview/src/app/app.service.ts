import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Agents} from "./agents.interface";
import {OAuthService} from "angular-oauth2-oidc";

@Injectable({
    providedIn: 'root',
})
export class AppService {
    private httpClient = inject(HttpClient);
    private oauthService = inject(OAuthService);

    getAgents(): Observable<Agents[]> {
        var headers = new HttpHeaders();
        headers.set('Accept', 'text/json');
        headers.set('Authorization', 'Bearer ' + this.oauthService.getAccessToken())
        console.log(this.oauthService.getAccessToken());
        return this.httpClient.get<Agents[]>('https://ply2.tributech-node.com/demeter/api/agents', { headers: headers});
    }
}