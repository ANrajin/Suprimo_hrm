import { Injectable } from "@angular/core";
import { Login } from "./login";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

interface loggedIn {
  status: boolean;
}
interface logout {
  status: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  serverUrl = "http://suprimo.chromaticbd.com/api";

  // private isLoggedInStatus = false;
  private isLoggedInStatus = JSON.parse(
    localStorage.getItem("loggedIn") || "false"
  );

  constructor(private _http: HttpClient) {}

  // setLoggedIn(value: boolean) {
  //   this.isLoggedInStatus = value;
  // }
  setLoggedIn(value: boolean) {
    this.isLoggedInStatus = value;
    localStorage.setItem("loggedIn", "true");
  }

  // get isLoggedIn() {
  //   return this.isLoggedInStatus;
  // }
  get isLoggedIn() {
    return JSON.parse(
      localStorage.getItem("loggedIn") || this.isLoggedInStatus.toString()
    );
  }

  login(login): Observable<Login> {
    return this._http.post<Login>(this.serverUrl + "/login", login);
  }

  userLoggedIn(): Observable<loggedIn> {
    return this._http.get<loggedIn>(this.serverUrl + "/auth");
  }

  logout() {
    return this._http.get<logout>(this.serverUrl + "/logout");
  }
}
