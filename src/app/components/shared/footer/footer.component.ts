import { Component } from "@angular/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
  title = "Sistema de Atención Veterinaria";
  currentYear: number = new Date().getFullYear();
}
