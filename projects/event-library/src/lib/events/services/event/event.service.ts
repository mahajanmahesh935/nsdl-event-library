import { Injectable } from "@angular/core";
import { DataService } from "../data-request/data-request.service";
import { UserConfigService } from "../userConfig/user-config.service";
import { DatePipe } from "@angular/common";

import { TimezoneCal } from "../../services/timezone/timezone.service";

@Injectable({
  providedIn: "root",
})
export class EventService {
  isEnroll: boolean = false;
  items: any;
  today = new Date();
  todayDate =
    this.today.getFullYear() +
    "-" +
    ("0" + (this.today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + this.today.getDate()).slice(-2);
  todayTime = this.today.getHours() + ":" + this.today.getMinutes();
  todayDateTime = this.timezoneCal.calcTime(this.todayDate, this.todayTime);

  constructor(
    private userConfigService: UserConfigService,
    private dataService: DataService,
    private timezoneCal: TimezoneCal,
    public datepipe: DatePipe
  ) {}

  /**
   * User meeting Attendance list
   */
  getAttendanceList_old(batchId) {
    const requestBody = {
      request: {
        batch: {
          batchId: batchId,
        },
      },
    };

    const option = {
      url: this.userConfigService.getConfigUrl().attendanceApi,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
      },
    };

    return this.dataService.get(option);
  }

  /**
   * User meeting Attendance list
   */
  getAttendanceList(contentId, batchId) {
    const requestBody = {
      request: {
        contentId: contentId,
        batchId: batchId,
      },
    };

    const option = {
      url: this.userConfigService.getConfigUrl().attendanceApi,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
        // 'X-Authenticated-User-Token' : AuthUserToken
      },
    };

    return this.dataService.post(option);
  }
  /**
   * To user enrolled event list
   */
  getParticipantsList(batchId) {
    const requestBody = {
      request: {
        batch: {
          batchId: batchId,
        },
      },
    };

    const BearerKey =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzVGRIUkFpTUFiRHN1SUhmQzFhYjduZXFxbjdyQjZrWSJ9.MotRsgyrPzt8O2jp8QZfWw0d9iIcZz-cfNYbpifx5vs";
    const AuthUserToken =
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJnaGFDNnd0U2Z6U3FkaXFzX3UxYzBMOVZCVDRtS0tUVEdxcU1KcU1OZUxZIn0.eyJqdGkiOiJmNWY4MDdlNS02OTgzLTQ5MDctOTIxNi04ZWYyNGUwNTcxMDQiLCJleHAiOjE2MzUyNzExMjYsIm5iZiI6MCwiaWF0IjoxNjM1MjI3OTI2LCJpc3MiOiJodHRwczovL3N0YWdpbmctc3VuYmlyZC5uc2RsLmNvLmluL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiMTEyNzNmODctYmY2MC00MWNmLWJhMWUtYzc4YTI5ODFmNDhjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibG1zIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiMWU2NjBkZjAtYjg2NC00MWFmLWI3NDctOTc1ZGYyMWZmZDNkIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3N0YWdpbmctc3VuYmlyZC5uc2RsLmNvLmluIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiXX0sImxtcyI6eyJyb2xlcyI6WyJ1bWFfcHJvdGVjdGlvbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiIiLCJjbGllbnRJZCI6ImxtcyIsImNsaWVudEhvc3QiOiIyMC4xOTguNjkuMTg3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWxtcyIsImNsaWVudEFkZHJlc3MiOiIyMC4xOTguNjkuMTg3IiwiZW1haWwiOiJzZXJ2aWNlLWFjY291bnQtbG1zQHBsYWNlaG9sZGVyLm9yZyJ9.cBXREgeXAA27oA6VHg1odsFnpj4mSdulhUieZF89sp_4xB_o9TYIpVUA9mTY601Cvhen7KRUUw2aP6gIHwdi-MKJgrWdSx3WmOkQW350ihD7pzneUcMn6O1NW92r84Jiwvqvg7O5Z-9r7EK4wnK66rJ5IfpSQb9Ebql0L7Yr45xTk_aDwVeIi-Nid-KuVgyOyUei14LXrktq-xVOa7_R6i2-qs3KmbskYSjmf9frlIGrZ264v9LkGJb2lSeWnsh0bD5IrQQnImpfX_sLsCVi5lmUqV2dMVcTwhGLG9Q3WknK98sj66PYdjYILE4srhhn86L0eX97n1GAMyItEAtC2A";

    const option = {
      url: this.userConfigService.getConfigUrl().participantsList,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
        // 'Authorization' : BearerKey,
        // 'X-Authenticated-User-Token' : AuthUserToken
      },
    };

    return this.dataService.get(option);
  }

  /**
   * To user enrolled event list
   */
  getEnrollEvents(cId, userId) {
    const requestBody = {
      request: {
        userId: userId,
      },
    };

    const BearerKey =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzVGRIUkFpTUFiRHN1SUhmQzFhYjduZXFxbjdyQjZrWSJ9.MotRsgyrPzt8O2jp8QZfWw0d9iIcZz-cfNYbpifx5vs";

    const option = {
      url: this.userConfigService.getConfigUrl().enrollUserEventList,
      data: requestBody,
      header: { "Content-Type": "application/json", Authorization: BearerKey },
    };

    return this.dataService.post(option);
  }

  /**
   *Admin enroll API for enrolling users into private event
   */

  adminEnroll(cId, uId, batchDetails) {
    const headers = {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzVGRIUkFpTUFiRHN1SUhmQzFhYjduZXFxbjdyQjZrWSJ9.MotRsgyrPzt8O2jp8QZfWw0d9iIcZz-cfNYbpifx5vs",
      "X-Authenticated-User-Token":
        "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0VzJHMGgzTVRhc01TekVzY2g2ZklsNG0tOUhQUl90Ny1lRkxqRzVxU1ZZIn0.eyJqdGkiOiJlNmFmMTNlZi04MDJhLTQzYTEtOGU0Yy1mOTQyNzc1OWRlZWUiLCJleHAiOjE3MTY5MTY0NDgsIm5iZiI6MCwiaWF0IjoxNzE2ODczMjQ4LCJpc3MiOiJodHRwczovL2Rldm51bHAubml1YS5vcmcvYXV0aC9yZWFsbXMvc3VuYmlyZCIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJmMzllOWU1Ni04MzA2LTQ1N2YtODAwMC01YWE5Y2NhMDI3ZWIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsbXMiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiIwMjlhMDg4MC1kZTgxLTQ5MzYtOGNlZi0yY2Y3ZTA5YzI5YjQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2bnVscC5uaXVhLm9yZyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiXX0sImxtcyI6eyJyb2xlcyI6WyJ1bWFfcHJvdGVjdGlvbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiIiLCJjbGllbnRJZCI6ImxtcyIsImNsaWVudEhvc3QiOiIxMTQuMTQzLjExOS4yMTgiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtbG1zIiwiY2xpZW50QWRkcmVzcyI6IjExNC4xNDMuMTE5LjIxOCIsImVtYWlsIjoic2VydmljZS1hY2NvdW50LWxtc0BwbGFjZWhvbGRlci5vcmcifQ.k5ILa28ApRF_WTtqKiX334r3-grOP7X_z3r_WmvzIXoZbYsolBkyjpzZJNHS4UYw9sCq4S3SDy8ooW3dBzOxY25i8lfv0Bl4LXI0zSCCAGC-TwdL4wYxG5p8gKZasjgThHh5_nPtUYiteUz016-YJ1H4gmakB77vDdFe3AwE1r2bzdvJp0JZUGCLUCsfB5SqwOg989ECnWzU0Eziq5rPEyiogPiAh2tmN9J57G5TpNbGFfca7xRpp1T996igoHHM_hkKoVU03rZzD8wZJa9COrjiHQcTOUx6rpWe0v966sbzbLEmfNZGhwDy7ciLgkafAMYR8TuNy7huzwaYD9S3-A",
    };
    const requestBody = {
      request: {
        courseId: cId,
        userId: uId,
        batchId: batchDetails.batchId,
      },
    };
    const req = {
      url: this.userConfigService.getConfigUrl().enrollApi,
      headers,
      data: requestBody,
    };
  }

  /**
   * For Enroll/Unenroll to the event
   */
  enrollToEventPost(action, cId, uId, batchDetails) {
    const headers = {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzVGRIUkFpTUFiRHN1SUhmQzFhYjduZXFxbjdyQjZrWSJ9.MotRsgyrPzt8O2jp8QZfWw0d9iIcZz-cfNYbpifx5vs",
      "X-Authenticated-User-Token":
        "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0VzJHMGgzTVRhc01TekVzY2g2ZklsNG0tOUhQUl90Ny1lRkxqRzVxU1ZZIn0.eyJqdGkiOiJlNmFmMTNlZi04MDJhLTQzYTEtOGU0Yy1mOTQyNzc1OWRlZWUiLCJleHAiOjE3MTY5MTY0NDgsIm5iZiI6MCwiaWF0IjoxNzE2ODczMjQ4LCJpc3MiOiJodHRwczovL2Rldm51bHAubml1YS5vcmcvYXV0aC9yZWFsbXMvc3VuYmlyZCIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJmMzllOWU1Ni04MzA2LTQ1N2YtODAwMC01YWE5Y2NhMDI3ZWIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsbXMiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiIwMjlhMDg4MC1kZTgxLTQ5MzYtOGNlZi0yY2Y3ZTA5YzI5YjQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2bnVscC5uaXVhLm9yZyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiXX0sImxtcyI6eyJyb2xlcyI6WyJ1bWFfcHJvdGVjdGlvbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiIiLCJjbGllbnRJZCI6ImxtcyIsImNsaWVudEhvc3QiOiIxMTQuMTQzLjExOS4yMTgiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtbG1zIiwiY2xpZW50QWRkcmVzcyI6IjExNC4xNDMuMTE5LjIxOCIsImVtYWlsIjoic2VydmljZS1hY2NvdW50LWxtc0BwbGFjZWhvbGRlci5vcmcifQ.k5ILa28ApRF_WTtqKiX334r3-grOP7X_z3r_WmvzIXoZbYsolBkyjpzZJNHS4UYw9sCq4S3SDy8ooW3dBzOxY25i8lfv0Bl4LXI0zSCCAGC-TwdL4wYxG5p8gKZasjgThHh5_nPtUYiteUz016-YJ1H4gmakB77vDdFe3AwE1r2bzdvJp0JZUGCLUCsfB5SqwOg989ECnWzU0Eziq5rPEyiogPiAh2tmN9J57G5TpNbGFfca7xRpp1T996igoHHM_hkKoVU03rZzD8wZJa9COrjiHQcTOUx6rpWe0v966sbzbLEmfNZGhwDy7ciLgkafAMYR8TuNy7huzwaYD9S3-A",
    };

    const requestBody = {
      request: {
        courseId: cId,
        userId: uId,
        batchId: batchDetails.batchId,
      },
    };

    if (action == "enroll") {
      const req = {
        url: this.userConfigService.getConfigUrl().enrollApi,
        headers,
        data: requestBody,
      };

      return this.dataService.post(req);
    } else if (action == "unenroll") {
      const req = {
        url: this.userConfigService.getConfigUrl().unenrollApi,
        data: requestBody,
      };

      return this.dataService.post(req);
    }
  }

  //  /**
  //   * Get a BBB Moderator meeting link
  //   * @param EventId
  //   * @returns BBB Moderator meeting link
  //   */
  //   getBBBURlModerator(EventId)
  //   {
  //       const req = {
  //         url: this.userConfigService.getConfigUrl().BBBGetUrlModerator + '/' + EventId
  //       };

  //       return this.dataService.get(req);
  //   }

  //  /**
  //   * Get BBB Attendee meeting link
  //   * @param EventId
  //   * @returns BBB Attendee meeting link
  //   */
  // getBBBURlAttendee(EventId)
  // {
  //     const req = {
  //       url: this.userConfigService.getConfigUrl().BBBGetUrlAttendee + '/' + EventId
  //     };
  //     return this.dataService.get(req);
  // }

  /**
   * Serch / get batchs
   * @param filterval array of filter values
   */
  getBatches(filterval) {
    const requestBody = {
      request: {
        filters: filterval,
        sort_by: {
          createdDate: "desc",
        },
      },
    };

    const BearerKey =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzVGRIUkFpTUFiRHN1SUhmQzFhYjduZXFxbjdyQjZrWSJ9.MotRsgyrPzt8O2jp8QZfWw0d9iIcZz-cfNYbpifx5vs";

    const option = {
      url: this.userConfigService.getConfigUrl().batchlist,
      data: requestBody,
      header: { "Content-Type": "application/json", Authorization: BearerKey },
    };

    return this.dataService.post(option);
  }

  /**
   * Create batch for event
   */
  createBatch(requestValue) {
    const requestBody = {
      request: requestValue,
    };

    // const BearerKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1S0xKdzBHRUd0M2VEMmlKNjJ1M05tRG1QY3Z6b0trWSJ9.6Av5aPfb_m22sCbbXdUKW3dQc8cRAt3tiIcCyGHjCzg";

    const option = {
      url: this.userConfigService.getConfigUrl().createBatch,
      data: requestBody,
      header: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzVGRIUkFpTUFiRHN1SUhmQzFhYjduZXFxbjdyQjZrWSJ9.MotRsgyrPzt8O2jp8QZfWw0d9iIcZz-cfNYbpifx5vs",
      },
    };

    return this.dataService.post(option);
  }

  /** Get event Status and show on list view
   * 1. Past
   * 2. Ongoing
   * 3. Upcoming
   * */
  // async getEventStatus(event) {

  //   // Event Start date time
  //   var startEventTime = await this.timezoneCal.calcTime(event.startDate, event.startTime);
  //   var startDifference = startEventTime.getTime() - this.todayDateTime.getTime();
  //   var startInMinutes = Math.round(startDifference / 60000);

  //   // Event end date time
  //   var endEventTime = this.timezoneCal.calcTime(event.endDate, event.endTime);
  //   var endDifference = this.todayDateTime.getTime() - endEventTime.getTime();
  //   var endInMinutes = Math.round(endDifference / 60000);

  //   if (startInMinutes >= 10 && endInMinutes < 0)
  //   {
  //     event.eventStatus = 'Upcoming';
  //     event.showDate = 'Satrting On: ' + event.startDate;
  //   }
  //   else if (startInMinutes <= 10 && endInMinutes < 0)
  //   {
  //     event.eventStatus = 'Ongoing';
  //     event.showDate = 'Ending On: ' + event.endDate;
  //   }
  //   else if (startInMinutes <= 10 && endInMinutes > 0)
  //   {
  //     event.eventStatus = 'Past';
  //     event.showDate = 'Ended On: ' + event.endDate;
  //   }

  //   return event;

  // }

  getBBBURl(EventId, uId) {
    const req = {
      url: this.userConfigService.getConfigUrl().BBBGetUrl + "/" + EventId,
    };

    return this.dataService.get(req);
  }

  convertDate(eventDate) {
    var date = new Date(eventDate),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);

    var datestr = [date.getFullYear(), mnth, day].join("/");

    return datestr;
  }
  /**
   * Get a BBB Moderator meeting link
   * @param EventId
   * @returns BBB Moderator meeting link
   */
  getBBBURlModerator(EventId, fullName, userId, muteUser, logoutUrl) {
    const requestBody = {
      request: {
        event: {
          userName: "G1",
        },
      },
    };
    const req = {
      url:
        this.userConfigService.getConfigUrl().BBBGetUrlModerator +
        "/" +
        EventId +
        "?userName=" +
        fullName +
        "&userId=" +
        userId +
        "&muteOnStart=" +
        muteUser +
        "&logoutURL=" +
        logoutUrl,
    };
    console.log(req);
    return this.dataService.get(req);
  }

  /**
   * Get BBB Attendee meeting link
   * @param EventId
   * @returns BBB Attendee meeting link
   */
  getBBBURlAttendee(EventId, fullName, userId, logoutUrl) {
    // curl --location --request GET 'https://staging-sunbird.nsdl.co.in/api/event/v4/join/moderator/do_21342283278607155213?userName=Gaurav Londhe&userId=882a43f3-9d17-49d7-b06b-a08219a09803&muteOnStart=true'
    const req = {
      url:
        this.userConfigService.getConfigUrl().BBBGetUrlAttendee +
        "/" +
        EventId +
        "?userName=" +
        fullName +
        "&userId=" +
        userId +
        "&logoutURL=" +
        logoutUrl,
    };

    return this.dataService.get(req);
  }

  async getEventStatus(event) {
    // Event Start date time
    var startEventTime = await this.timezoneCal.calcTime(
      event.startDate,
      event.startTime
    );
    var startDifference =
      startEventTime.getTime() - this.todayDateTime.getTime();
    var startInMinutes = Math.round(startDifference / 60000);

    // Event end date time
    var endEventTime = this.timezoneCal.calcTime(event.endDate, event.endTime);
    var endDifference = this.todayDateTime.getTime() - endEventTime.getTime();
    var endInMinutes = Math.round(endDifference / 60000);

    var timezoneshort = this.timezoneCal.timeZoneAbbreviated();

    if (startInMinutes >= 10 && endInMinutes < 0) {
      event.eventStatus = "Upcoming";
      // event.showDate = 'Starting On ' + event.startDate;
      event.showDate =
        "Starting On " +
        this.datepipe.transform(event.startDate, "longDate") +
        ", " +
        this.datepipe.transform(startEventTime, "HH:mm") +
        " (" +
        timezoneshort +
        ")";
    } else if (startInMinutes <= 10 && endInMinutes < 0) {
      event.eventStatus = "Ongoing";
      // event.showDate = 'Ending On ' + event.endDate;
      event.showDate =
        "Ending On " +
        this.datepipe.transform(event.endDate, "longDate") +
        ", " +
        this.datepipe.transform(endEventTime, "HH:mm") +
        " (" +
        timezoneshort +
        ")";
    } else if (startInMinutes <= 10 && endInMinutes > 0) {
      event.eventStatus = "Past";
      event.showDate =
        "Ended On " +
        this.datepipe.transform(event.endDate, "longDate") +
        ", " +
        this.datepipe.transform(endEventTime, "HH:mm") +
        " (" +
        timezoneshort +
        ")";
    }

    return event;
  }
}
