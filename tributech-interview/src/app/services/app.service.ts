import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Agents} from "../models/agents.interface";
import {OAuthService} from "angular-oauth2-oidc";

@Injectable({
    providedIn: 'root',
})
export class AppService {
    private httpClient = inject(HttpClient);
    private oauthService = inject(OAuthService);

    getAgents(): Observable<Agents[]> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.oauthService.getAccessToken()
        });
        return this.httpClient.get<Agents[]>('https://ply2.tributech-node.com/demeter/api/agents', { headers: headers});
    }
}