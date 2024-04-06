import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Agents} from "../models/agents.interface";
import {AppService} from "../services/app.service";
import {map, Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
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
    imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, AsyncPipe, MatButton, MatIconButton, MatIcon, FormsModule, MatFormField, MatLabel],
})
export class AppComponent implements AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    displayedColumns: string[] = ['isOnline', 'name', 'deviceType', 'keyStorageType', 'proofKind', 'actions'];
    appService = inject(AppService);
    agents$ = of(ELEMENT_DATA);//: Observable<Agents[]>;
    agentsDataSource = new MatTableDataSource<Agents>();
    filterString = '';

    constructor(private oauthService: OAuthService) {
        const authConfig: AuthConfig = {

            // Url des Authorization-Servers
            issuer: 'https://auth.ply2.tributech-node.com/realms/node',

            // Url der Angular-Anwendung
            // An diese URL sendet der Authorization-Server den Access Code
            redirectUri: 'http://localhost:4200/',

            // Name der Angular-Anwendung
            clientId: 'dataspace-admin',

            // Rechte des Benutzers, die die Angular-Anwendung wahrnehmen möchte
            scope: 'openid profile email offline_access api',

            // Code Flow (PKCE ist standardmäßig bei Nutzung von Code Flow aktiviert)
            responseType: 'code'

        }
        /*    oauthService.configure(authConfig);
            oauthService.loadDiscoveryDocumentAndTryLogin();
            oauthService.setupAutomaticSilentRefresh();

            this.oauthService.initCodeFlow();*/

        this.refresh();
    }

    ngAfterViewInit() {
        this.agentsDataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this.oauthService.logOut();
    }

    filterTableElements(filter: string) {
        this.agentsDataSource.filter = filter.toLowerCase();
    }

    refresh(): void {
        this.agentsDataSource = new MatTableDataSource<Agents>();
        this.agents$ = of(ELEMENT_DATA);
        // this.agents$ = this.appService.getAgents();

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

const ELEMENT_DATA: Agents[] = [
    {isOnline: true, name: 'Hydrogen', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Helium', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Lithium', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Beryllium', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Boron', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Carbon', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: false, name: 'Boron', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: false, name: 'Carbon', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: false, name: 'Fluorine', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: false, name: 'Neon', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Hydrogen', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Helium', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Lithium', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Beryllium', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Boron', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: true, name: 'Carbon', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: false, name: 'Boron', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: false, name: 'Carbon', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: false, name: 'Fluorine', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
    {isOnline: false, name: 'Neon', deviceType: 'EDGE', keyStorageType: 'NONE', proofKind: 'SHA256_RSA2048_PSS'},
];
