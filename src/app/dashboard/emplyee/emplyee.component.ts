import { Component, OnInit } from "@angular/core";
import { Emplyee } from "./emplyee";
import { EmplyeeService } from "./emplyee.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-emplyee",
  templateUrl: "./emplyee.component.html",
  styleUrls: ["./emplyee.component.css"],
})
export class EmplyeeComponent implements OnInit {
  employees: Emplyee[];
  users;
  departments;
  positions;
  checks = false;
  public temp: Object = false;

  constructor(private employee: EmplyeeService, private _fb: FormBuilder) {}

  ngOnInit() {
    //get All Employee list
    this.employee.getEmployee().subscribe((res) => {
      this.employees = res;
    });

    //get all department data
    this.employee.getUsers().subscribe((res) => {
      this.users = res;
    });

    //get all department data
    this.employee.getDept().subscribe((res) => {
      this.departments = res;
    });

    //get all position data
    this.employee.getPost().subscribe((res) => {
      this.positions = res;
    });
  }

  checkAll(e) {
    if (e.target.checked == true) {
      this.checks = true;
    } else {
      this.checks = false;
    }
  }

  /**
   * Add new item
   * @param id
   */
  employeeForm = this._fb.group({
    user_id: new FormControl("", [Validators.required]),
    f_name: new FormControl("", [Validators.required]),
    l_name: new FormControl("", [Validators.required]),
    address: new FormControl("", [Validators.required]),
    dob: new FormControl("", [Validators.required]),
    joinDate: new FormControl("", [Validators.required]),
    department_id: new FormControl("", [Validators.required]),
    position_id: new FormControl("", [Validators.required]),
    status: new FormControl("", [Validators.required]),
  });

  //Get the instance of input field
  get user_id() {
    return this.employeeForm.get("user_id");
  }
  get f_name() {
    return this.employeeForm.get("f_name");
  }
  get l_name() {
    return this.employeeForm.get("l_name");
  }
  get address() {
    return this.employeeForm.get("address");
  }
  get dob() {
    return this.employeeForm.get("dob");
  }
  get joinDate() {
    return this.employeeForm.get("joinDate");
  }
  get department_id() {
    return this.employeeForm.get("department_id");
  }
  get position_id() {
    return this.employeeForm.get("position_id");
  }
  get status() {
    return this.employeeForm.get("status");
  }

  onSubmit() {
    // if (this.employeeForm.invalid) {
    //   alert("Cannot Submit! One or more field is empty");
    // } else {
    let formData = new FormData();
    formData.append("user_id", this.employeeForm.get("user_id").value);
    formData.append("f_name", this.employeeForm.get("f_name").value);
    formData.append("l_name", this.employeeForm.get("l_name").value);
    formData.append("address", this.employeeForm.get("address").value);
    formData.append("dob", this.employeeForm.get("dob").value);
    formData.append("joinDate", this.employeeForm.get("joinDate").value);
    formData.append(
      "department_id",
      this.employeeForm.get("department_id").value
    );
    formData.append("position_id", this.employeeForm.get("position_id").value);
    formData.append("status", this.employeeForm.get("status").value);

    this.employee.addEmployee(formData).subscribe((res) => {
      if (res["status"] == "200") {
        this.employees = res["employees"];
        this.employeeForm.reset();
        this.temp = true;
        $("#empAdd").modal("hide");
      } else if (res["status"] == "404") {
        alert("Something went wrong!!!");
      } else {
        alert(res["status"]);
      }
    });
    // }
  }

  /**
   * Edit Position
   * @param id
   */
  employeeEdit = new FormGroup({
    id: new FormControl(""),
    user_id: new FormControl(""),
    f_name: new FormControl(""),
    l_name: new FormControl(""),
    address: new FormControl(""),
    dob: new FormControl(""),
    joinDate: new FormControl(""),
    department_id: new FormControl(""),
    position_id: new FormControl(""),
    status: new FormControl(""),
  });

  onEdit(employee) {
    this.employeeEdit.setValue({
      id: employee.id,
      user_id: employee.user_id,
      f_name: employee.first_name,
      l_name: employee.last_name,
      address: employee.address,
      dob: employee.dob,
      joinDate: employee.join_date,
      department_id: employee.department_id,
      position_id: employee.position_id,
      status: employee.status,
    });
  }

  /**
   * Update Single item
   * @param id
   */
  onUpdate(): void {
    let formData = new FormData();
    formData.append("id", this.employeeEdit.get("id").value);
    formData.append("user_id", this.employeeEdit.get("user_id").value);
    formData.append("f_name", this.employeeEdit.get("f_name").value);
    formData.append("l_name", this.employeeEdit.get("l_name").value);
    formData.append("address", this.employeeEdit.get("address").value);
    formData.append("dob", this.employeeEdit.get("dob").value);
    formData.append("joinDate", this.employeeEdit.get("joinDate").value);
    formData.append(
      "department_id",
      this.employeeEdit.get("department_id").value
    );
    formData.append("position_id", this.employeeEdit.get("position_id").value);
    formData.append("status", this.employeeEdit.get("status").value);

    this.employee.updateEmp(formData).subscribe((res) => {
      if (res["status"] == "200") {
        this.employees = res["employees"];
        this.temp = true;
        $("#empEdit").modal("hide");
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
  onDelete(event) {
    if (confirm("Are sure to delete?")) {
      this.employee.onDelete(event).subscribe((res) => {
        if (res["status"] == "200") {
          this.employees = res["employees"];
        } else if (res["status"] == "404") {
          alert("Something went wrong!!!");
        } else {
          alert(res["status"]);
        }
      });
    }
  }
}
