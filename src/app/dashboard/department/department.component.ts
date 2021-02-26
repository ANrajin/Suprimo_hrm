import { Component, OnInit } from "@angular/core";
import { Department } from "./department";
import { DepartmentService } from "./department.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.css"],
})
export class DepartmentComponent implements OnInit {
  constructor(
    private deptService: DepartmentService,
    private _fb: FormBuilder
  ) {}

  departments: Department[];
  public temp: Object = false;

  ngOnInit() {
    //get departments list
    this.deptService.getDept().subscribe((data: Department[]) => {
      this.departments = data;
    });
  }

  deptForm = this._fb.group({
    title: new FormControl("", [Validators.required]),
    description: new FormControl(""),
  });

  /**
   * Get the instance of input field
   */
  get title() {
    return this.deptForm.get("title");
  }

  /**
   * Form Submittion
   */
  onSubmit(): void {
    if (this.deptForm.invalid) {
      alert("one or more field is empty");
    } else {
      let formData = new FormData();
      formData.append("title", this.deptForm.get("title").value);
      formData.append("description", this.deptForm.get("description").value);
      this.deptService.addDept(formData).subscribe((res) => {
        if (res["status"] == "200") {
          this.departments = res["departments"];
          this.deptForm.reset();
        } else if (res["status"] == "404") {
          alert("Something went wrong!!!");
        } else {
          alert(res["status"]);
        }
      });
    }
  }

  /**
   * Data edit
   * @param event
   */
  deptEdit = new FormGroup({
    id: new FormControl(),
    title: new FormControl(),
    description: new FormControl(),
  });

  onEdit(department) {
    this.deptEdit.setValue({
      id: department.id,
      title: department.title,
      description: department.description,
    });
  }

  /**
   * Data update
   * @param event
   */
  onUpdate(): void {
    let formData = new FormData();
    formData.append("id", this.deptEdit.get("id").value);
    formData.append("title", this.deptEdit.get("title").value);
    formData.append("description", this.deptEdit.get("description").value);
    this.deptService.updateDept(formData).subscribe((res) => {
      if (res["status"] == "200") {
        this.departments = res["departments"];
        this.temp = true;
        $("#deptEdit").modal("hide");
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
      this.deptService.onDelete(event).subscribe((res) => {
        if (res["status"] == "200") {
          this.departments = res["departments"];
        } else if (res["status"] == "404") {
          alert("Something went wrong!!!");
        } else {
          alert(res["status"]);
        }
      });
    }
  }
}
