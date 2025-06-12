"use client"
import { Component } from "@angular/core";
import { VeterinarianDashboardComponent } from "../../components/veterinario/veterinarian-dasboard.component";

@Component({
  selector: "app-veterinario-page",
  standalone: true,
  imports: [VeterinarianDashboardComponent],
  templateUrl: "./veterinario-page.component.html",
  styleUrls: ["./veterinario-page.component.css"],
})
export class VeterinarioPageComponent {
  // Aquí puedes agregar lógica adicional si es necesario
}
