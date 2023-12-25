import { Component, ElementRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

const BASE_CONNECTION_STRING = "ws://localhost:4200/stream/connect";

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent {
  terminal: Terminal;
  socket: WebSocket;

  fitAddon: FitAddon;

  @ViewChild('terminal') terminalContainer: ElementRef;

  constructor(private cookieService: CookieService) {
    this.cookieService.set('cookieName', 'cookieValue');
  }

  ngOnInit(): void {
    this.initTerminal(BASE_CONNECTION_STRING);
  }

  ngAfterViewInit() {
    this.terminal.open(this.terminalContainer.nativeElement);
    this.fitAddon.fit();
  }

  ngOnDestroy(): void {
    //Dispose the terminal
    this.terminal.dispose();

    //Close the WebSocket connection when the component is destroyed
    this.socket.close();
  }

  private initTerminal(connectionString: string) {
    this.terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block'
    });

    //Use the following connection string when the backend is ready
    //const newConnectionString = `${BASE_CONNECTION_STRING}/fortigate_id=${id}`

    this.socket = new WebSocket(connectionString);

    //Error handling
    this.socket.addEventListener("error", e => {
      let key = "websocket-websocket-generic-error";
      if ((e.target as any).readyState === 3) {
        key = "websocket-connection";
      }

      const errorMsg = "error";
      this.terminal.write(errorMsg);
    });

    //Bind the websocket connection with the xterm
    const attatchAddon = new AttachAddon(this.socket, {
      bidirectional: true
    });
    this.terminal.loadAddon(attatchAddon);

    //Resize the terminal to fit the container
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
  }
}
