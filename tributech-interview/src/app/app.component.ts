import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Agents} from "./agents.interface";
import {AppService} from "./app.service";
import {map, Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, AsyncPipe],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'name'];
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
    this.agents$ = this.appService.getAgents();

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
  {position: 1, name: 'Hydrogen'},
  {position: 2, name: 'Helium'},
  {position: 3, name: 'Lithium'},
  {position: 4, name: 'Beryllium'},
  {position: 5, name: 'Boron'},
  {position: 6, name: 'Carbon'},
  {position: 7, name: 'Nitrogen'},
  {position: 8, name: 'Oxygen'},
  {position: 9, name: 'Fluorine'},
  {position: 10, name: 'Neon'},
  {position: 11, name: 'Sodium'},
  {position: 12, name: 'Magnesium'},
  {position: 13, name: 'Aluminum'},
  {position: 14, name: 'Silicon'},
  {position: 15, name: 'Phosphorus'},
  {position: 16, name: 'Sulfur'},
  {position: 17, name: 'Chlorine'},
  {position: 18, name: 'Argon'},
  {position: 19, name: 'Potassium'},
  {position: 20, name: 'Calcium'},
];
