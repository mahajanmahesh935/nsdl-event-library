import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EventCreateService } from "../../services/event-create/event-create.service";
import { EventDetailService } from "../../services/event-detail/event-detail.service";
import { EventService } from "../../services/event/event.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { SbToastService } from "../../services/iziToast/izitoast.service";
import { TimezoneCal } from "../../services/timezone/timezone.service";
// import { TranslateService } from '@ngx-translate/core';
import { UserConfigService } from "../../services/userConfig/user-config.service";
import { ImageSearchService } from "../../services/image-search/image-search.service";
import * as _ from "lodash-es";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import { LibEventService } from "../../services/lib-event/lib-event.service";
// import  userData from "../../../../../../../src/assets/api/userList.json";
// const eventFormConfig = require("../../../../../../../src/assets/api/useList.json");
import {
  of as observableOf,
  throwError as observableThrowError,
  Observable,
} from "rxjs";

@Component({
  selector: "sb-event-create",
  templateUrl: "./event-create.component.html",
  styleUrls: ["./event-create.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EventCreateComponent implements OnInit {
  @Input("formFieldProperties") formFieldProperties: any;

  // @Input() userId: any;
  userId: any;
  eventConfig: any;
  initialFormFieldProperties: any;
  // users: any[] = eventFormConfig.result.response.content;
  selectedUser: any;
  selectedUserList: string[] = [];
  // console.log(user);

  @Output() closeSaveForm = new EventEmitter();
  @Output() navAfterSave = new EventEmitter();

  today = new Date();
  todayDate =
    this.today.getFullYear() +
    "-" +
    ("0" + (this.today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + this.today.getDate()).slice(-2);

  formValues: any;

  startTime: any =
    ("0" + (this.today.getHours() + 1)).slice(-2) +
    ":" +
    ("0" + this.today.getMinutes()).slice(-2);
  endTime: any =
    ("0" + (this.today.getHours() + 2)).slice(-2) +
    ":" +
    ("0" + this.today.getMinutes()).slice(-2);
  registrationStartDate: any = this.todayDate;
  registrationEndDate: any = this.todayDate;
  timeDiff: any;
  queryParams: any;
  eventDetailsForm: any;
  isSubmitted = false;
  formFieldData: any;
  FormData: any;
  isNew: boolean = true;
  timezoneshort: any;
  canPublish: boolean = false;
  offset = this.timezoneCal.getTimeOffset();
  constFormFieldProperties: any;
  flag: boolean = true;
  tempEventType = null;
  tempVisibility = null;
  tempRecuring: boolean = false;
  tempTypeRecuring = null;
  tempRepeatEveryRecurring = null;
  tempEndRecurring: boolean = false;
  tempEndRecVeriable: String;
  isDisabled: boolean = false;
  defaultTypeOfRecurring: String;
  weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  prefixes = ["First", "Second", "Third", "Fourth", "Fifth"];
  tempEndRecurringVar: String;
  eventValue: any;
  ImageConfig: any;
  // Ankita changes
  public showAppIcon = true;
  public appIconConfig = {
    code: "appIcon",
    dataType: "text",
    description: "appIcon of the content",
    editable: true,
    inputType: "appIcon",
    label: "Icon",
    name: "Icon",
    placeholder: "Icon",
    renderingHints: { class: "sb-g-col-lg-1 required" },
    required: true,
    visible: true,
  };
  public appIcon: any;
  editmode: any;
  public showImagePicker = true;
  tempOnlineProvider: any;
  @Input()
  selectedUserIds: string[] = []; // Array to store selected user IDs

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventCreateService: EventCreateService,
    private eventDetailService: EventDetailService,
    private eventService: EventService,
    private router: Router,
    private location: Location,
    private sbToastService: SbToastService,
    private formBuilder: FormBuilder,
    private timezoneCal: TimezoneCal,
    // private translate: TranslateService,
    private userConfigService: UserConfigService,
    private imageSearchService: ImageSearchService,
    public libEventService: LibEventService
  ) {}

  // Ankita changes
  setAppIconData() {
    const isRootNode = true;
    this.appIcon = this.queryParams?.appIcon;
    // this.appIcon = "";
    if (this.isReviewMode()) {
      this.appIconConfig = {
        ...this.appIconConfig,
        ...{ isAppIconEditable: false },
      };
    } else {
      this.appIconConfig = {
        ...this.appIconConfig,
        ...{ isAppIconEditable: true },
      };
    }
  }

  isSelected(userId: string): boolean {
    return this.selectedUserIds.includes(userId);
  }

  toggleSelection(userId: string): void {
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1); // Remove if already selected
    } else {
      this.selectedUserIds.push(userId); // Add if not selected
    }
  }

  getSelectedUserIds(): string[] {
    console.log(this.selectedUserIds);
    return this.selectedUserIds;
  }
  isReviewMode() {
    // this.imageSearchService.getEditMode().subscribe((data: any) => {
    this.editmode = "edit";
    // });

    return _.includes(["review", "read", "sourcingreview"], this.editmode);
  }

  ngOnInit() {
    // console.log("------", this.user);
    // console.log("");
    const response = this.eventCreateService.getUserData();
    console.log("response---------", response);
    //     this.eventCreateService.getUserData().subscribe()=>{
    //  console.log("response---------", response);
    //     }
    this.eventConfig = _.get(this.libEventService.eventConfig, "context.user");
    this.userId = this.eventConfig.id;
    this.ImageConfig = _.get(this.libEventService.eventConfig, "context");
    this.timezoneshort = this.timezoneCal.timeZoneAbbreviated();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
      if (this.queryParams?.identifier) {
        this.isNew = false;
      }
    });

    if (this.queryParams?.identifier) {
      this.eventCreateService.getEventFormConfig().subscribe((data: any) => {
        //this.formFieldProperties = data.result['form'].data.fields;
        this.formFieldProperties = data.result["form"].data.properties;
      });

      this.eventDetailService.getEvent(this.queryParams?.identifier).subscribe(
        (data: any) => {
          if (data.result.event.status == "Live") {
            this.isDisabled = true;
          }
          this.queryParams = data.result.event;
          setTimeout(() => this.initializeFormFields(), 500);
          this.setAppIconData();
        },
        (err: any) => {}
      );
    }

    if (!this.queryParams.identifier) {
      this.prepareFormConfiguration();
    }
    let group = {};
  }

  // onUserChange(event: Event) {
  //   this.selectedUser = (event.target as HTMLSelectElement).value;
  //   console.log("Selected user:", this.selectedUser);
  //   // Handle additional logic based on the selected user if needed
  // }

  // Ankita changes
  ngOnChanges() {
    this.setAppIconData();
  }

  /*
   * For set event form config
   */
  prepareFormConfiguration() {
    this.formFieldProperties.forEach((formField) => {
      //console.log("FF-",formField);
      formField.fields.forEach((formField) => {
        switch (formField.code) {
          case "eventType":
            this.tempEventType = formField.default ? formField.default : null;
            this.setEventTypeDependentFields(formField.default);
            break;

          case "registrationStartDate":
          case "registrationEndDate":
          case "startDate":
          case "endDate":
            formField.default = this.todayDate;
            break;

          case "startTime":
            formField.default = this.startTime;
            break;

          case "endTime":
            formField.default = this.endTime;
            break;
        }
      });
    });
    this.onValueChangeUpdateFieldBehaviour();
  }

  /**
   * For setting event Dependent Fields
   */
  setEventTypeDependentFields(value) {
    switch (value) {
      case "Online":
        this.clearEventTypeFieldsOnSwitch();
        this.formFieldProperties[1].fields[1].editable = true;
        this.formFieldProperties[1].fields[2].editable = false;
        this.formFieldProperties[1].fields[3].editable = false;
        break;

      case "Offline":
        this.clearEventTypeFieldsOnSwitch();
        this.formFieldProperties[1].fields[1].editable = true;
        this.formFieldProperties[1].fields[2].editable = false;
        this.formFieldProperties[1].fields[3].editable = false;
        break;

      case "OnlineAndOffline":
        this.clearEventTypeFieldsOnSwitch();
        this.formFieldProperties[1].fields[1].editable = true;
        this.formFieldProperties[1].fields[2].editable = false;
        this.formFieldProperties[1].fields[3].editable = false;
        break;

      default:
        this.formFieldProperties[1].fields[1].editable = false;
        this.formFieldProperties[1].fields[2].editable = false;
        this.formFieldProperties[1].fields[3].editable = false;
        break;
    }
  }

  clearEventTypeFieldsOnSwitch() {
    this.formFieldProperties[1].fields[1].default = ""; //venue
    this.formFieldProperties[1].fields[2].default = null; //online provider
    this.formFieldProperties[1].fields[3].default = ""; //online provider data(link)
    this.formFieldProperties[1].fields[3].placeholder = "https://meetingLink";
  }

  output(event) {}

  onStatusChanges(event) {}

  initializeFormFields() {
    var editValues = {};
    var eventStart = this.timezoneCal.calcTime(
      this.queryParams["startDate"],
      this.queryParams["startTime"]
    );
    var eventEnd = this.timezoneCal.calcTime(
      this.queryParams["endDate"],
      this.queryParams["endTime"]
    );

    this.formFieldProperties.forEach((formField) => {
      formField.fields.forEach((formField) => {
        if (formField.code in this.queryParams) {
          if (formField.code == "venue") {
            formField.default = this.queryParams[formField.code]["name"];
            editValues[formField.code] =
              this.queryParams[formField.code]["name"];
          } else if (formField.code == "onlineProviderData") {
            formField.default = this.queryParams[formField.code]["meetingLink"];
            editValues[formField.code] =
              this.queryParams[formField.code]["meetingLink"];
          } else if (formField.code == "eventType") {
            formField.default = this.queryParams[formField.code];
            editValues[formField.code] = this.queryParams[formField.code];
            this.setEventTypeDependentFields(formField.default);
          } else if (formField.code == "startTime") {
            (formField.default =
              ("0" + eventStart.getHours()).slice(-2) +
              ":" +
              ("0" + eventStart.getMinutes()).slice(-2) +
              ":" +
              ("0" + eventStart.getSeconds()).slice(-2)),
              (editValues[formField.code] = this.queryParams[formField.code]);
          } else if (formField.code == "endTime") {
            (formField.default =
              ("0" + eventEnd.getHours()).slice(-2) +
              ":" +
              ("0" + eventEnd.getMinutes()).slice(-2) +
              ":" +
              ("0" + eventEnd.getSeconds()).slice(-2)),
              (editValues[formField.code] = this.queryParams[formField.code]);
          } else {
            formField.default = this.queryParams[formField.code];
            editValues[formField.code] = this.queryParams[formField.code];
          }
        }
      });
    });

    this.formValues = editValues;
    this.formFieldData = this.formFieldProperties;
  }

  /**
   * For Changing values on event form
   */
  valueChanges(eventData) {
    // console.log("Date-",eventData);
    if (eventData) {
      this.formValues = eventData;
      if (this.flag) {
        this.constFormFieldProperties = this.formFieldProperties;
        this.flag = false;
      } else {
        console.log("ED-", this.constFormFieldProperties);
        this.formFieldProperties = this.constFormFieldProperties;
        this.formFieldProperties.forEach((formField) => {
          formField.fields.forEach((formField) => {
            //console.log(formField.fields.code,"Code");
            formField.default = eventData[formField.code];
          });
        });
      }
    }

    let eventType;

    if (eventData.eventType != this.tempEventType) {
      this.tempEventType = eventData.eventType;
      this.setEventTypeDependentFields(eventData.eventType);
      this.onValueChangeUpdateFieldBehaviour();
    }

    if (eventData.onlineProvider != this.tempOnlineProvider) {
      this.tempOnlineProvider = eventData.onlineProvider;
      this.setOnlineProviderDependentFields(eventData.onlineProvider);
      this.onValueChangeUpdateFieldBehaviour();
    }
  }
  setOnlineProviderDependentFields(value) {
    switch (value) {
      case "BigBlueButton":
        this.formFieldProperties[1].fields[3].editable = false;
        this.formFieldProperties[1].fields[3].placeholder = "Auto Generated";
        break;

      case "Google Meet":
      case "Zoom":
      case "Jitsi":
        this.formFieldProperties[1].fields[3].editable = true;
        this.formFieldProperties[1].fields[3].placeholder =
          "https://meetingLink";
        break;
      default:
        this.formFieldProperties[1].fields[3].editable = true;
        this.formFieldProperties[1].fields[3].placeholder =
          "https://meetingLink";
        break;
    }
  }

  /**
   * For values change on form after change in checkbox, dropdown fields
   */
  onValueChangeUpdateFieldBehaviour() {
    this.formFieldProperties = JSON.parse(
      JSON.stringify(this.formFieldProperties)
    );
    if (this.formFieldData) {
      this.formFieldData = JSON.parse(JSON.stringify(this.formFieldData));
    }
  }

  /**
   * For validate data and call post form service
   */
  postData(canPublish) {
    this.isSubmitted = true;
    this.canPublish = canPublish;
    if (this.formValues == undefined) {
      this.sbToastService.showIziToastMsg("Please enter event name", "warning");
    } else if (
      this.formValues.name == undefined ||
      this.formValues.name.trim() == ""
    ) {
      this.sbToastService.showIziToastMsg("Please enter event name", "warning");
    } else if (this.formValues.code == undefined) {
      this.sbToastService.showIziToastMsg("Please enter code", "warning");
    } else if (this.formValues.eventType == undefined) {
      this.sbToastService.showIziToastMsg(
        "Please select event type",
        "warning"
      );
    } else if (
      this.formValues.startDate == undefined ||
      this.formValues.startDate == ""
    ) {
      this.sbToastService.showIziToastMsg(
        "Please enter valid event start date",
        "warning"
      );
    } else if (
      this.formValues.endDate == undefined ||
      this.formValues.endDate == ""
    ) {
      this.sbToastService.showIziToastMsg(
        "Please enter valid event end date",
        "warning"
      );
    } else if (
      this.formValues.startTime == undefined ||
      this.formValues.startTime == ""
    ) {
      this.sbToastService.showIziToastMsg(
        "Please enter Start event time",
        "warning"
      );
    } else if (
      this.formValues.endTime == undefined ||
      this.formValues.endTime == ""
    ) {
      this.sbToastService.showIziToastMsg(
        "Please enter End event time",
        "warning"
      );
    } else if (
      this.formValues.registrationStartDate == undefined ||
      this.formValues.registrationStartDate == ""
    ) {
      this.sbToastService.showIziToastMsg(
        "Please enter valid event registration start date",
        "warning"
      );
    } else if (
      this.formValues.registrationEndDate == undefined ||
      this.formValues.registrationEndDate == ""
    ) {
      this.sbToastService.showIziToastMsg(
        "Please enter valid registration end date",
        "warning"
      );
    } else if (
      !this.dateValidation(
        this.formValues.startDate + " " + this.formValues.startTime,
        this.formValues.endDate + " " + this.formValues.endTime
      )
    ) {
      this.sbToastService.showIziToastMsg(
        "Event end date should be greater than start date",
        "warning"
      );
    } else if (
      this.formValues.startDate < this.formValues.registrationStartDate &&
      this.formValues.startDate != this.formValues.registrationStartDate
    ) {
      this.sbToastService.showIziToastMsg(
        "Registration start date should be less than event start date",
        "warning"
      );
    } else if (
      !this.dateValidation(
        this.formValues.registrationStartDate,
        this.formValues.registrationEndDate
      )
    ) {
      this.sbToastService.showIziToastMsg(
        "Registration end date should be greater than registration start date",
        "warning"
      );
    } else if (
      !this.dateValidation(
        this.formValues.registrationStartDate + " 00:00:00",
        this.formValues.endDate
      )
    ) {
      this.sbToastService.showIziToastMsg(
        "Registration start date should be less than event end date",
        "warning"
      );
    } else if (
      !this.dateValidation(
        this.formValues.registrationEndDate + " 00:00:00",
        this.formValues.endDate
      )
    ) {
      this.sbToastService.showIziToastMsg(
        "Registration end date should be less than event end date",
        "warning"
      );
    } else if (
      this.formValues.onlineProvider != "BigBlueButton" &&
      this.formValues.onlineProviderData == undefined &&
      this.formValues.eventType == "OnlineandOffline"
    ) {
      this.sbToastService.showIziToastMsg(
        "Please enter online provider's link",
        "warning"
      );
    } else {
      this.formValues = Object.assign(this.formValues);

      if (this.queryParams?.identifier) {
        this.formValues["identifier"] = this.queryParams.identifier;
      }

      this.formValues["onlineProviderData"] =
        this.formValues["onlineProviderData"] != null
          ? { meetingLink: this.formValues["onlineProviderData"] }
          : {};
      this.formValues["venue"] = { name: this.formValues["venue"] };
      this.formValues["owner"] = this.userId;
      this.formValues["createdFor"] = this.eventConfig.organisationIds;
      // this.formValues['onlineProviderData'] = {};
      this.formValues["appIcon"] = this.appIcon;

      if (this.isNew) {
        if (this.queryParams?.endTime != this.formValues.endTime) {
          this.formValues["endTime"] =
            this.formValues["endTime"] + ":10" + this.offset;
        }

        if (this.queryParams?.startTime != this.formValues.startTime) {
          this.formValues["startTime"] =
            this.formValues["startTime"] + ":10" + this.offset;
        }
        this.eventCreateService.createEvent(this.formValues).subscribe(
          (data) => {
            if (data.responseCode == "OK") {
              this.dataSubmitted(data, "create");
              this.eventCreateService
                .creategmeetEvent(this.formValues)
                .subscribe((data) => {});
            }
          },
          (err: any) => {
            console.log("Errr, ", err);
            this.sbToastService.showIziToastMsg(err.message, "error");
          }
        );
      } else {
        if (this.queryParams?.endTime != this.formValues.endTime) {
          this.formValues["endTime"] = this.formValues["endTime"] + this.offset;
        }

        if (this.queryParams?.startTime != this.formValues.startTime) {
          this.formValues["startTime"] =
            this.formValues["startTime"] + this.offset;
        }
        this.formValues["versionKey"] = this.queryParams.versionKey;
        this.eventCreateService.updateEvent(this.formValues).subscribe(
          (data) => {
            if (data.responseCode == "OK") {
              this.dataSubmitted(data, "update");
            }
          },
          (err) => {
            console.log({ err });
            // this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
          }
        );
      }
    }
  }

  dataSubmitted(data, task) {
    console.log("######################", data);

    if (this.canPublish) {
      this.eventCreateService
        .publishEvent(data.result.identifier)
        .subscribe((res) => {
          if (task == "create") {
            this.sbToastService.showIziToastMsg(
              "Event Created Successfully",
              "success"
            );
          } else {
            this.sbToastService.showIziToastMsg(
              "Event updated Successfully",
              "success"
            );
          }

          // Only publish event can able to create batch
          this.createEventBatch(data);

          this.navAfterSave.emit(data);
        });
    } else {
      if (task == "create") {
        this.sbToastService.showIziToastMsg(
          "Event Created Successfully",
          "success"
        );
      } else {
        this.sbToastService.showIziToastMsg(
          "Event updated Successfully",
          "success"
        );
      }

      this.navAfterSave.emit(data);
    }
  }

  onUserSelect(users: string[]) {
    this.selectedUserList = users;
  }

  /**
   * NOTE: Once the event is created, the batch will be created automatically.
   * Right now the batch is not created after event creating, so we are implementing some temporary solution
   *
   * Create event batch
   * Here, confirm that one event have only one batch.
   * @param data array of created event id
   * @param formValue event form value
   */
  createEventBatch(data) {
    // Check whether Event has batch or not
    // filter set for serch batch for selected event
    let filters = {
      courseId: data.result.identifier,
      // enrollmentType: "open",
    };

    this.eventDetailService
      .getEvent(data.result.identifier)
      .subscribe((response: any) => {
        this.eventValue = response.result.event;

        // Determine the enrollment type and user list based on event visibility
        let enrollmentType =
          this.eventValue.eventVisibility === "Private"
            ? "invite-only"
            : "open";

        // request value for create batch for selected event
        let createBatchRequestValue = {
          courseId: data.result.identifier,
          name: "Batch for event - " + data.result.identifier,
          description: "Batch for event - " + data.result.identifier,
          enrollmentType: enrollmentType,
          startDate: this.eventValue.startDate,
          endDate: this.eventValue.endDate,
          createdBy: this.eventValue.owner,
        };
        console.log("******************", createBatchRequestValue);

        this.eventService.getBatches(filters).subscribe(
          (res) => {
            if (res.responseCode == "OK") {
              if (res.result.response.count == 0) {
                // If batch not created then create the batch for event
                this.eventService
                  .createBatch(createBatchRequestValue)
                  .subscribe(
                    (createRes) => {
                      var action = "enroll";
                      this.eventService
                        .enrollToEventPost(
                          action,
                          data.result.identifier,
                          "6939db9e-94ac-4748-b53f-7b2fc59b30b1",
                          createRes.result
                        )
                        .subscribe((res) => {});
                    },
                    (err) => {
                      console.log(
                        { err },
                        "sdfghjiuyfcvbftyhjdc hncdx hncdjhn jjch"
                      );
                      // this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
                    }
                  );
              } else {
                return observableOf(res.result.response.content[0]);
              }
            }
          },
          (err) => {
            console.log({ err });
            this.sbToastService.showIziToastMsg(
              err.error.result.messages[0],
              "error"
            );
          }
        );
      });
  }

  cancel() {
    this.closeSaveForm.emit();
  }

  /**
   * For time validation
   *
   * @param sdate Contains data
   * @param time Contains time
   * @returns Return true if event start time is greater current time
   */
  timeValidation(date, time) {
    var startEventTime = new Date(date + " " + time);
    var startDifference = startEventTime.getTime() - this.today.getTime();
    var timeDiff = Math.round(startDifference / 60000);

    return timeDiff > 0 ? true : false;
  }

  /**
   * For date validation
   *
   * @param sdate Contains start data
   * @param edate Contains end data
   * @returns
   */
  dateValidation(sdate, edate) {
    var startEventDate = new Date(sdate);
    var endEventDate = new Date(edate);

    var startDifference = endEventDate.getTime() - startEventDate.getTime();
    var timeDiff = Math.round(startDifference / 60000);

    return timeDiff >= 0 ? true : false;
  }

  appIconDataHandler(event) {
    this.appIcon = event.url;
  }
}
