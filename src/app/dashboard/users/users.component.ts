import { Component, OnInit } from "@angular/core";
import { UsersService } from "./users.service";
import { Users } from "./users";
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  constructor(private _userService: UsersService, private _fb: FormBuilder) {}
  roles;
  users: Users[];
  userEdit;
  selectFile;
  unamePattern = "^[A-Za-z ]{5,15}$";
  phoneNumber = "^([0-9]{11})$";
  emailPattern = "^[a-z0-9_]+@[a-z]+\\.[a-z]{2,3}$";
  public temp: Object = false;

  ngOnInit() {
    //get roles from database
    this._userService.getRoles().subscribe((data: Users[]) => {
      this.roles = data;
      this.temp = true;
    });

    //get all user data
    this._userService.getUsers().subscribe((users: Users[]) => {
      this.users = users;
    });
  }

  /**
   * Reactive form
   */
  userForm = this._fb.group({
    username: new FormControl("", [
      Validators.required,
      Validators.pattern(this.unamePattern),
    ]),
    email: new FormControl("", [
      Validators.required,
      Validators.pattern(this.emailPattern),
    ]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern(this.phoneNumber),
    ]),
    password: new FormControl("", [Validators.required]),
    confirm: new FormControl("", [Validators.required]),
    role: new FormControl("", [Validators.required]),
    image: new FormControl("", [Validators.required]),
  });

  /**
   * Get the instance of input field
   */
  get username() {
    return this.userForm.get("username");
  }
  get email() {
    return this.userForm.get("email");
  }
  get phone() {
    return this.userForm.get("phone");
  }
  get password() {
    return this.userForm.get("password");
  }
  get confirm() {
    return this.userForm.get("confirm");
  }
  get role() {
    return this.userForm.get("role");
  }
  get image() {
    return this.userForm.get("image");
  }

  uploadFile(event) {
    let elm = event.target;
    if (elm.files.length > 0) {
      this.selectFile = elm.files[0];
    }
  }

  /**
   * Create new user
   */
  onSubmit(): void {
    let formData = new FormData();
    formData.append("name", this.userForm.get("username").value);
    formData.append("email", this.userForm.get("email").value);
    formData.append("phone", this.userForm.get("phone").value);
    formData.append("password", this.userForm.get("password").value);
    formData.append("role", this.userForm.get("role").value);
    formData.append("file", this.selectFile);
    this._userService.addUser(formData).subscribe((res) => {
      if (res["status"] == "200") {
        this.users = res["users"];
        this.userForm.reset();
      } else if (res["status"] == "404") {
        alert("Something went wrong!!!");
      } else {
        alert(res["status"]);
      }
    });
  }

  /**
   * Edit user
   * @param event
   */
  userEditForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    role_id: new FormControl(),
  });

  onEdit(user) {
    this.userEditForm.setValue({
      id: user.id,
      name: user.username,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id,
    });
  }

  /**
   * User Update
   * @param event
   */
  onUpdate(): void {
    let formData = new FormData();
    formData.append("id", this.userEditForm.get("id").value);
    formData.append("name", this.userEditForm.get("name").value);
    formData.append("email", this.userEditForm.get("email").value);
    formData.append("phone", this.userEditForm.get("phone").value);
    formData.append("role_id", this.userEditForm.get("role_id").value);
    this._userService.updateUser(formData).subscribe((res) => {
      if (res["status"] == "200") {
        this.users = res["users"];
        this.temp = true;
        $("#userEdit").modal("hide");
      } else if (res["status"] == "404") {
        alert("Something went wrong!!!");
      } else {
        alert(res["status"]);
      }
    });
  }

  /**
   * Delete data
   */
  onDelete(id) {
    if (confirm("Are sure to delete?")) {
      this._userService.onDelete(id).subscribe((res) => {
        if (res["status"] == "200") {
          this.users = res["users"];
        } else if (res["status"] == "404") {
          alert("Something went wrong!!!");
        } else {
          alert(res["status"]);
        }
      });
    }
  }
}
