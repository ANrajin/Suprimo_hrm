import { Component, OnInit } from "@angular/core";
import { Position } from "./position";
import { PositionService } from "./position.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-position",
  templateUrl: "./position.component.html",
  styleUrls: ["./position.component.css"],
})
export class PositionComponent implements OnInit {
  constructor(
    private _postService: PositionService,
    private _fb: FormBuilder
  ) {}

  positions: Position[];
  departments;
  public temp: Object = false;

  ngOnInit() {
    /**
     * Get all departments
     */
    this._postService.getDept().subscribe((res) => {
      this.departments = res;
    });

    /**
     * Get All Positions
     */
    this._postService.getPost().subscribe((res: Position[]) => {
      this.positions = res;
    });
  }

  /**
   * Add new item
   * @param id
   */
  postForm = this._fb.group({
    post_title: new FormControl("", [Validators.required]),
    dept: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
  });

  //Get the instance of input field
  get post_title() {
    return this.postForm.get("post_title");
  }
  get dept() {
    return this.postForm.get("dept");
  }
  get description() {
    return this.postForm.get("description");
  }

  onSubmit() {
    if (this.postForm.invalid) {
      alert("Cannot Submit! One or more field is empty");
    } else {
      let formData = new FormData();
      formData.append("post_title", this.postForm.get("post_title").value);
      formData.append("dept_id", this.postForm.get("dept").value);
      formData.append("description", this.postForm.get("description").value);

      this._postService.addPost(formData).subscribe((res) => {
        if (res["status"] == "200") {
          this.positions = res["positions"];
          this.postForm.reset();
        } else if (res["status"] == "404") {
          alert("Something went wrong!!!");
        } else {
          alert(res["status"]);
        }
      });
    }
  }

  /**
   * Edit Position
   * @param id
   */
  postEdit = new FormGroup({
    id: new FormControl(""),
    post_title: new FormControl(""),
    dept: new FormControl(""),
    description: new FormControl(""),
  });

  onEdit(position) {
    this.postEdit.setValue({
      id: position.id,
      post_title: position.post_title,
      dept: position.dept_id,
      description: position.description,
    });
  }

  /**
   * Update Single item
   * @param id
   */
  onUpdate(): void {
    let formData = new FormData();
    formData.append("id", this.postEdit.get("id").value);
    formData.append("post_title", this.postEdit.get("post_title").value);
    formData.append("dept_id", this.postEdit.get("dept").value);
    formData.append("description", this.postEdit.get("description").value);

    this._postService.updatePost(formData).subscribe((res) => {
      if (res["status"] == "200") {
        this.positions = res["positions"];
        this.temp = true;
        $("#postEdit").modal("hide");
      } else if (res["status"] == "404") {
        alert("Something went wrong!!!");
      } else {
        alert(res["status"]);
      }
    });
  }

  /**
   * Delete item
   */
  onDelete(id: number): void {
    if (confirm("Are sure to delete?")) {
      this._postService.onDelete(id).subscribe((res) => {
        if (res["status"] == "200") {
          this.positions = res["positions"];
        } else if (res["status"] == "404") {
          alert("Something went wrong!!!");
        } else {
          alert(res["status"]);
        }
      });
    }
  }
}
