import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EventCreateService } from "../../../projects/event-library/src/lib/events/services/event-create/event-create.service";

import { EventDetailService } from "./../../../projects/event-library/src/lib/events/services/event-detail/event-detail.service";
import { LibEventService } from "./../../../projects/event-library/src/lib/events/services/lib-event/lib-event.service";
import * as _ from "lodash-es";
// import { DataService } from "../data-request/data-request.service";
// import { UserConfigService } from "../userConfig/user-config.service";
import { UserConfigService } from "../../../projects/event-library/src/lib/events/services/userConfig/user-config.service";

import { DataService } from "../../../projects/event-library/src/lib/events/services/data-request/data-request.service";

// const eventFormConfig = require("../../../src/assets/api/event-create-working-sb-dynamic.json");

@Component({
  selector: "app-user-fom",
  templateUrl: "./user-fom.component.html",
  styleUrls: ["./user-fom.component.scss"],
})
export class UserFomComponent implements OnInit {
  isDetail = false;
  eventItem: any;
  userId: any;
  formFieldProperties: any;
  eventConfig: any;

  constructor(
    private eventCreateService: EventCreateService,
    private eventDetailService: EventDetailService,
    private router: Router,
    private libEventService: LibEventService,
    private dataService: DataService,
    private userConfigService: UserConfigService
  ) {}

  ngOnInit() {
    this.showEventCreatePage();
    this.eventConfig = _.get(this.libEventService.eventConfig, "context.user");
    this.userId = this.eventConfig.id;
  }

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

  showEventCreatePage() {
    this.getEventFormConfig().subscribe((data: any) => {
      console.log(data);

      this.formFieldProperties = data.result["form"].data.properties;
    });
  }

  cancel() {
    this.router.navigate(["/demo"]);
  }

  navAfterSave(res) {
    //  alert(res.result.identifier);
    this.eventDetailService.getEvent(res.result.identifier).subscribe(
      (data: any) => {
        this.eventItem = data.result.event;
        this.isDetail = true;
      },
      (err: any) => {
        console.log("err = ", err);
      }
    );
    // this.eventItem = res.result.event;
    // alert('hi');
  }

  getId(res) {
    this.router.navigate(["/form"], {
      queryParams: {
        identifier: res.identifier,
        versionKey: res.versionKey,
      },
    });

    setTimeout(function () {
      this.window.location.reload();
    }, 2000);
  }
}
