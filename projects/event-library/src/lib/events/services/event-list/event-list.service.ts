import { Injectable } from "@angular/core";
import { UserConfigService } from "../userConfig/user-config.service";
import { DataService } from "../data-request/data-request.service";
import { environment } from "../../environment";

@Injectable({
  providedIn: "root",
})
export class EventListService {
  constructor(
    private userConfigService: UserConfigService,
    private dataService: DataService
  ) {}

  /**
   * For get event list
   */
  getEventList(filterValue, query?: any, sort_by?: any, dataLimit?: any) {
    if (sort_by == undefined) {
      sort_by = {
        startDate: "desc",
      };
    }
    const requestBody = {
      request: {
        filters: filterValue,

        query: query,
        sort_by: sort_by,
        limit: dataLimit,
      },
    };
    const BearerKey = environment.bearerToken;

    const option = {
      url: this.userConfigService.getConfigUrl().search,
      data: requestBody,
      header: { "Content-Type": "application/json", Authorization: BearerKey },
    };

    return this.dataService.post(option);
  }

  getFilteredEventList(
    filterValue1: string | null,
    filterValue2: string | null,
    query: string | null,
    eventType: string
  ) {
    const BearerKey = environment.bearerToken;
    const requestBody: any = {
      request: {
        query: query,
        filters: {
          contentType: ["Event"],
        },
        sort_by: {
          lastUpdatedOn: "desc",
        },
      },
    };

    if (filterValue1 && filterValue2) {
      requestBody.request.filters.startDate = {
        ">=": filterValue1,
        "<=": filterValue2,
      };
    }

    if (eventType !== null) {
      requestBody.request.filters.eventVisibility = eventType;
    }

    const option = {
      url: this.userConfigService.getConfigUrl().search,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
        Authorization: BearerKey,
      },
    };

    return this.dataService.post(option);
  }

  /**
   * For getting filter config
   */
  /**
   * For get event form config
   */
  //  getFilterFormConfig() {
  //   const req = {
  //     url: this.userConfigService.getConfigUrl().eventFilterConfigApi
  //   };
  //   return this.dataService.get(req);
  // }

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

  getMyEventsFilterFormConfig() {
    const requestBody = {
      request: {
        type: "content",
        subtype: "myevents",
        action: "filter",
        component: "*",
        framework: "*",
        rootOrgId: "*",
      },
    };
    const req = {
      url: this.userConfigService.getConfigUrl().myEventFilterConfigApi,
      data: requestBody,
      header: { "Content-Type": "application/json" },
    };
    return this.dataService.post(req);
    // return this.dataService.get(req);
  }

  getMyEventList(userId) {
    const requestBody = {
      request: {
        userId: userId,
      },
    };

    const BearerKey = environment.bearerToken;

    const option = {
      url: this.userConfigService.getConfigUrl().myEvents,
      data: requestBody,
      header: { "Content-Type": "application/json", Authorization: BearerKey },
    };

    return this.dataService.post(option);
  }

  // getEventFilters() {
  // return this.http.get<any>('assets/eventFilter.json');
  // }

  getCalenderlist() {
    const req = {
      url: this.userConfigService.getConfigUrl().calenderevent,
    };

    return this.dataService.get(req);
  }

  /**
   * For get event list
   */
  retireEvent(element, sort_by?: any) {
    if (sort_by == undefined) {
      sort_by = {
        startDate: "desc",
      };
    }
    const requestBody = {
      request: {},
    };

    const option = {
      url:
        "https://staging-sunbird.nsdl.co.in/api/collection/v1/retire/" +
        element,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
        Cookie:
          "connect.sid=s%3APqakdmwDDGc1MAlJz0ptw56ANuT-YbDA.HszjiZ1XeU4xpM7FdyvMpBNqoruvXYfZqi2cfRwAMig",
        // 'X-Authenticated-User-Token': xAuth,
        //  'Authorization': BearerKey
      },
    };
    return this.dataService.delete(option);
  }
}
