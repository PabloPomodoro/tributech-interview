import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Agents} from "./agents.interface";
import {AppService} from "./app.service";
import {map, Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";

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

  constructor() {
    this.refresh();
  }

  refresh() : void {
    //this.agents$ = this.appService.getAgents();

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
