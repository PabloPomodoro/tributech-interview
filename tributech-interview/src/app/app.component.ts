import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Agents} from "./agents.interface";
import {AppService} from "./app.service";
import {map, Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {OAuthService} from "angular-oauth2-oidc";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, AsyncPipe, MatButton, MatIconButton, MatIcon],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['isOnline', 'name', 'deviceType', 'keyStorageType', 'proofKind', 'actions'];
  appService = inject(AppService);
  agents$ = of(ELEMENT_DATA);//: Observable<Agents[]>;
  agentsDataSource = new MatTableDataSource<Agents>();

  constructor(private oauthService: OAuthService) {

    // URL of the SPA to redirect the user to after login
    this.oauthService.redirectUri = "http://localhost:4200";

    // The SPA's id. The SPA is registered with this id at the auth-server
    this.oauthService.clientId = "dataspace-admin";

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a use case specific one
    this.oauthService.scope = "openid profile email voucher";

    // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
    // OAuth2-based access_token
    this.oauthService.oidc = true; // ID_Token

    // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
    // instead of localStorage
    this.oauthService.setStorage(sessionStorage);

    // Discovery Document of your AuthServer as defined by OIDC
    let url = 'https://auth.ply2.tributech-node.com';

    // Load Discovery Document and then try to log in the user
    this.oauthService.loadDiscoveryDocument(url).then(() => {

      // This method just tries to parse the token(s) within the url when
      // the auth-server redirects the user back to the web-app
      // It doesn't send the user the login page
      this.oauthService.tryLogin({});

    });

    this.refresh();
  }

  refresh() : void {
    // this.agents$ = this.appService.getAgents();

    this.agents$.pipe(map(agents => {
      agents.sort((a, b) => Number(b.isOnline) - Number(a.isOnline));
      agents.sort((a, b) => a.name.localeCompare(b.name))

      return new MatTableDataSource<Agents>(agents);
    })).subscribe(agents => {
      // sadly the reactive way seems not to be possible, because of the paginator
      this.agentsDataSource = agents;
    });
  }

  ngAfterViewInit() {
    this.agentsDataSource.paginator = this.paginator;
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
];
