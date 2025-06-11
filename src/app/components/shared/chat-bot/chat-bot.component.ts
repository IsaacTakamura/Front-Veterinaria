import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {
  chatVisible = false;
  userInput = '';
  showFAQs = false;
  chatClosed = false;

  messages: { sender: 'user' | 'bot', text: string }[] = [
    { sender: 'bot', text: '¡Hola! Soy Utevet 🐶, tu asistente veterinario. ¿Te puedo ayudar con preguntas frecuentes?' }
  ];

  faqs = [
    {
      pregunta: '¿Qué vacunas necesita mi cachorro?',
      respuesta: 'Los cachorros deben recibir vacunas contra moquillo, parvovirus, hepatitis y rabia. Agenda con nosotros para personalizar el esquema.'
    },
    {
      pregunta: '¿Cada cuánto debo bañar a mi perro?',
      respuesta: 'En promedio, cada 3 o 4 semanas. Aunque varía según la raza, clima y actividad.'
    },
    {
      pregunta: '¿Atienden emergencias?',
      respuesta: '¡Sí! Atendemos emergencias 24/7. Llama al 999-999-999 o visítanos.'
    }
  ];

  toggleChat() {
    if (this.chatClosed) return;
    this.chatVisible = !this.chatVisible;
  }

  closeChat() {
    this.messages = [
      { sender: 'bot', text: '¡Hola! Soy Utevet 🐶, tu asistente veterinario. ¿En qué puedo ayudarte?' }
    ];
    this.chatVisible = false;
    this.userInput = '';
    this.showFAQs = false;
  }

  sendQuestion(pregunta: string, respuesta: string) {
    this.messages.push({ sender: 'user', text: pregunta });
    this.messages.push({ sender: 'bot', text: respuesta });
    this.userInput = '';
  }

  sendCustomMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ sender: 'user', text });

    const lower = text.toLowerCase();
    const isThanks = ['gracias', 'thank you', 'muchas gracias'].some(t => lower.includes(t));

    if (isThanks) {
      this.messages.push({
        sender: 'bot',
        text: '¡Nos alegra ayudarte! 🐾 Puedes cerrar este chat o agendar una cita con nosotros cuando gustes.'
      });
      this.showFAQs = false;
    } else {
      this.messages.push({
        sender: 'bot',
        text: 'Gracias por tu consulta 🐶. Aquí tienes algunas opciones que podrían ayudarte:'
      });
      this.showFAQs = true;
    }

    this.userInput = '';
  }
}
