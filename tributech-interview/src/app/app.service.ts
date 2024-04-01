import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Agents} from "./agents.interface";

@Injectable({
    providedIn: 'root',
})
export class AppService {
    private httpClient = inject(HttpClient);

    getAgents(): Observable<Agents[]> {
        return this.httpClient.get<Agents[]>('https://ply2.tributech-node.com/demeter/api/agents');
    }
}