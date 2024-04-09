import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Agents} from "../models/agents.interface";
import {AppService} from "../services/app.service";
import {map, Observable} from "rxjs";
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: true,
    imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButton, MatIconButton, MatIcon, FormsModule, MatFormField, MatLabel],
})
export class AppComponent implements AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    displayedColumns: string[] = ['isOnline', 'name', 'deviceType', 'keyStorageType', 'proofKind', 'actions'];

    agents$= new Observable<Agents[]>;
    agentsDataSource = new MatTableDataSource<Agents>();
    filterString = '';

    appService = inject(AppService);

    constructor(private oauthService: OAuthService) {
        const authConfig: AuthConfig = {
            issuer: 'https://auth.ply2.tributech-node.com/realms/node',
            redirectUri: 'http://localhost:4200/',
            clientId: 'dataspace-admin',
            scope: 'openid token-api agent-api',
            responseType: 'code'

        }
        oauthService.configure(authConfig);
        oauthService.loadDiscoveryDocumentAndTryLogin();
        oauthService.setupAutomaticSilentRefresh();

        this.refresh();
    }

    ngAfterViewInit() {
        this.agentsDataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this.oauthService.logOut();
    }

    login() {
        this.oauthService.initCodeFlow();
    }

    filterTableElements(filter: string) {
        this.agentsDataSource.filter = filter.toLowerCase();
    }

    refresh(): void {
        this.agentsDataSource = new MatTableDataSource<Agents>();
        this.agents$ = this.appService.getAgents();

        this.agents$.pipe(map(agents => {
            agents.sort((a, b) => a.name.localeCompare(b.name))
            agents.sort((a, b) => Number(b.isOnline) - Number(a.isOnline));

            return new MatTableDataSource<Agents>(agents);
        })).subscribe(agents => {
            // sadly the reactive way doesn't seem to be possible, because of the paginator
            this.agentsDataSource = agents;
            this.agentsDataSource.paginator = this.paginator;
            this.agentsDataSource.filterPredicate = (data: {
                name: string
            }, filterValue: string) => data.name.trim().toLowerCase().indexOf(filterValue) !== -1;

            this.filterString = '';
        });
    }
}
