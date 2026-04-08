import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { HousingLocation } from "../housing-location";
import { HousingLocationComponent } from "../housing-location/housing-location.component";
import { HousingService } from "../housing.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter />
        <button
          class="primary"
          type="button"
          (click)="filterResults(filter.value)"
        >
          Seach
        </button>
      </form>
    </section>
    <section class="results">
      @for (housingLocation of filteredLocationList; track housingLocation.id) {
        <app-housing-location
          [housingLocation]="housingLocation"
          [isFavourite]="checkIsFavourite(housingLocation.id)"
          (toggleFavourite)="toggleFavourite($event, housingLocation)"
        ></app-housing-location>
      }
    </section>
  `,
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);
  filteredLocationList: HousingLocation[] = [];
  favouriteList = this.getFavouriteList();

  constructor() {
    this.housingService
      .getAllHousingLocations()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
        this.filteredLocationList = housingLocationList;
      });
  }

  filterResults(text: string) {
    if (!text) this.filteredLocationList = this.housingLocationList;

    this.filteredLocationList = this.housingLocationList.filter(
      (housingLocation) =>
        housingLocation?.city
          .toLocaleLowerCase()
          .includes(text.toLocaleLowerCase()),
    );
  }

  checkIsFavourite(id: number) {
    return this.favouriteList.some((fav) => fav.id === id);
  }

  getFavouriteList(): HousingLocation[] {
    try {
      return JSON.parse(localStorage.getItem("favouriteList") ?? "[]");
    } catch {
      return [];
    }
  }

  toggleFavourite(isFavourite: boolean, housingLocation: HousingLocation) {
    const prevList = this.favouriteList;
    const isExistInList = this.checkIsFavourite(housingLocation.id);

    const updateList =
      isFavourite && !isExistInList
        ? [...prevList, housingLocation]
        : prevList.filter((fav) => fav.id !== housingLocation.id);

    localStorage.setItem("favouriteList", JSON.stringify(updateList));
    this.favouriteList = updateList;
  }
}
