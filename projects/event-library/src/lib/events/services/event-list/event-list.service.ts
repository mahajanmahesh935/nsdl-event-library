import { Injectable } from "@angular/core";
import { UserConfigService } from "../userConfig/user-config.service";
import { DataService } from "../data-request/data-request.service";

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

    const option = {
      url: this.userConfigService.getConfigUrl().search,
      data: requestBody,
      header: { "Content-Type": "application/json" },
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

    const BearerKey =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzVGRIUkFpTUFiRHN1SUhmQzFhYjduZXFxbjdyQjZrWSJ9.MotRsgyrPzt8O2jp8QZfWw0d9iIcZz-cfNYbpifx5vs";

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

    // const BearerKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1S0xKdzBHRUd0M2VEMmlKNjJ1M05tRG1QY3Z6b0trWSJ9.6Av5aPfb_m22sCbbXdUKW3dQc8cRAt3tiIcCyGHjCzg";
    // const xAuth = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJnaGFDNnd0U2Z6U3FkaXFzX3UxYzBMOVZCVDRtS0tUVEdxcU1KcU1OZUxZIn0.eyJqdGkiOiIwNWZlNmY0Ni0yNzFmLTQ0OTEtOTVmMS0yMTNjOTdhMDg1YTUiLCJleHAiOjE2NDA4ODA5MzMsIm5iZiI6MCwiaWF0IjoxNjQwODM3NzMzLCJpc3MiOiJodHRwczovL3N0YWdpbmctc3VuYmlyZC5uc2RsLmNvLmluL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiMTEyNzNmODctYmY2MC00MWNmLWJhMWUtYzc4YTI5ODFmNDhjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibG1zIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiYmRiYWE2NGUtZjFmYi00MjQ3LWJhNDYtMzliZTdmY2UyZTYzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3N0YWdpbmctc3VuYmlyZC5uc2RsLmNvLmluIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiXX0sImxtcyI6eyJyb2xlcyI6WyJ1bWFfcHJvdGVjdGlvbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiIiLCJjbGllbnRJZCI6ImxtcyIsImNsaWVudEhvc3QiOiI0NS4xMjYuMTcwLjE2NCIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1sbXMiLCJjbGllbnRBZGRyZXNzIjoiNDUuMTI2LjE3MC4xNjQiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC1sbXNAcGxhY2Vob2xkZXIub3JnIn0.bNjleMnp70X43jvKO_0IKlPUHilOmx6IylPflYiw6HyEyFT9i4RPCcpj_8wNaCKnQzkYvtxQ_olhqSaEG-OumAwKQbfydzpw-C4PDUzN1E5T_GiyeEZzNwR6SQp2gGK6VikUv-eBjn5JMgfH3gTvoYsBASeIw5VIOhQNRN4NuWYGLMKEGwUJY1pf8qhEdSkCb_mbeBb1-pHQXbPcz2MgFcX2hJDA_F-hZFE0okCpDY5bSDRVLxxtU70JypggFlW33jhCJCpV72CvVwrrZx4iOjLsE9g2L5bszLqODL-vpFw92WkgVyelATEIuqKj-OxYprVr8ueIuyn1FqyF05npEg";
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
