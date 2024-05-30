import { Injectable } from "@angular/core";
import { SbToastService } from "../../services/iziToast/izitoast.service";
import { UserConfigService } from "../userConfig/user-config.service";
import { DataService } from "../data-request/data-request.service";

@Injectable({
  providedIn: "root",
})
export class EventFilterService {
  constructor(
    private userConfigService: UserConfigService,
    private dataService: DataService,
    private sbToastService: SbToastService
  ) {}

  // /**
  //  * For get event form config old
  //  */
  // getFilterFormConfig() {
  //   const req = {
  //     url: this.userConfigService.getConfigUrl().eventFilterConfigApi
  //   };
  //   return this.dataService.get(req);
  // }

  /**
   * For get event form config
   */
  getFilterFormConfig() {
    const requestBody = {
      request: {
        type: "content",
        subtype: "event",
        action: "filter",
        component: "*",
        framework: "*",
        rootOrgId: "*",
      },
    };

    const req = {
      url: this.userConfigService.getConfigUrl().eventFilterConfigApi,
      data: requestBody,
      header: { "Content-Type": "application/json" },
    };

    return this.dataService.post(req);
  }

  /**
   * For post filter data
   */
  filterEvent(formData) {
    const requestBody = {
      request: {
        event: formData,
      },
    };

    const option = {
      url: this.userConfigService.getConfigUrl().create,
      data: requestBody,
      header: { "Content-Type": "application/json" },
    };

    return this.dataService.post(option);
  }
}
