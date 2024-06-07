import { Injectable } from "@angular/core";
import { SbToastService } from "../../services/iziToast/izitoast.service";
import { UserConfigService } from "../userConfig/user-config.service";
import { DataService } from "../data-request/data-request.service";
import { environment } from "../../environment";

@Injectable({
  providedIn: "root",
})
export class EventCreateService {
  constructor(
    private userConfigService: UserConfigService,
    private dataService: DataService,
    private sbToastService: SbToastService
  ) {}

  /**
   * For get event form config
   */
  getEventFormConfig_old() {
    const req = {
      url: this.userConfigService.getConfigUrl().eventFormConfigApi,
    };
    return this.dataService.get(req);
  }

  getUserData() {
    const requestBody = {
      request: {
        filters: {
          status: "1",
        },
        sort_by: {
          lastUpdatedOn: "desc",
        },
      },
    };
    const req = {
      url: "https://nulp.niua.org/learner/user/v3/search",
      data: requestBody,
      header: {
        Cookie:
          "_clck=19ahivn%7C2%7Cfly%7C0%7C1519; _ga=GA1.1.1345435117.1714108269; _ga_QH3SHT9MTG=GS1.1.1716290807.35.1.1716290845.0.0.0; _ga_EJDFKF9L1X=GS1.1.1716290808.35.1.1716290845.0.0.0; connect.sid=s%3A4GTOjub8cQT2AlEOCNMsU-7C4bcwX7zN.CFtUqWb36sx9sOrRn%2BXM%2BuezkMO%2BbvmSCvGdvYrkeMk",
      },
    };
    return this.dataService.post(req);
  }

  /**
   * For get event form config
   */
  getEventFormConfig() {
    const requestBody = {
      request: {
        type: "content",
        subtype: "event",
        action: "create",
        // component: "*",
        framework: "*",
        rootOrgId: "0137236500887961602",
      },
    };

    const req = {
      url: this.userConfigService.getConfigUrl().eventFormConfigApi,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
      },
    };

    return this.dataService.post(req);
  }

  /**
   * For post event data
   */
  createEvent(formData) {
    const requestBody = {
      request: {
        event: formData,
      },
    };

    const option = {
      url: this.userConfigService.getConfigUrl().create,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
        // Authorization: environment.bearerToken,
      },
    };

    return this.dataService.post(option);
  }

  creategmeetEvent(formData) {
    const requestBody = {
      request: {
        event: {
          event_name: formData.name,
          description: formData.description,
          event_type: formData.eventType,
          start_time: formData.startTime,
          start_date: formData.startDate,
          end_time: formData.endTime,
          end_date: formData.endDate,
        },
      },
    };

    const option = {
      url: this.userConfigService.getConfigUrl().gmeetcreate,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
        // Authorization:
      },
    };

    return this.dataService.post(option);
  }

  updateEvent(formData) {
    const requestBody = {
      request: {
        event: formData,
      },
    };

    const option = {
      url:
        this.userConfigService.getConfigUrl().update +
        "/" +
        formData["identifier"],
      data: requestBody,
      header: { "Content-Type": "application/json" },
    };

    return this.dataService.patch(option);

    // this.sbToastService.showIziToastMsg("New Event Created Successfully", 'success');
  }

  getGmeetLink() {
    const option = {
      url: this.userConfigService.getConfigUrl().gmeetget,
    };

    return this.dataService.get(option);
  }

  updateEventwithGmeetLink(formData) {
    const requstBody = {
      request: {
        event: {
          onlineProviderData: {
            formData,
          },
        },
      },
    };
    const option = {
      url:
        this.userConfigService.getConfigUrl().update +
        "/" +
        formData["identifier"],
      data: requstBody,
      header: { "Content-Type": "application/json" },
    };

    return this.dataService.patch(option);
  }
  /**
   * For publish event
   */
  publishEvent(identifier) {
    const option = {
      url: this.userConfigService.getConfigUrl().publish + "/" + identifier,
      header: {
        "Content-Type": "application/json",
        Authorization: environment.bearerToken,
      },
    };

    return this.dataService.post(option);
  }
}
