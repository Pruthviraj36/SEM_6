from textual.widgets import Static, Input, Log
from textual.containers import Container
from textual.app import ComposeResult

class ConsoleWidget(Container):
    """
    Handles command input and displays logs.
    """

    def compose(self) -> ComposeResult:
        yield Log(id="log_output")
        yield Input(placeholder="Enter command...", id="command_input")

    def log_message(self, message: str) -> None:
        log_output = self.query_one("#log_output", Log)
        log_output.write_line(str(message))

    def on_input_submitted(self, event: Input.Submitted) -> None:
        command = event.value
        event.input.value = ""
        self.process_command(command)

    def process_command(self, command_str: str) -> None:
        log = self.query_one("#log_output", Log)
        log.write_line(f"> {command_str}")
        
        parts = command_str.split()
        if not parts:
            return
            
        cmd = parts[0].lower()
        
        if cmd == "help":
            self.log_message("Available commands:\n - list <ip>: List files on remote peer\n - get <ip> <filename>: Download file from peer\n - myip: Show local IP\n - exit: Quit")
            
        elif cmd == "list":
            if len(parts) < 2:
                self.log_message("Usage: list <peer_ip>")
                return
            peer_ip = parts[1]
            self.log_message(f"Fetching file list from {peer_ip}...")
            # Run in thread to avoid blocking UI
            import threading
            threading.Thread(target=self._async_list, args=(peer_ip,), daemon=True).start()

        elif cmd == "get":
            if len(parts) < 3:
                self.log_message("Usage: get <peer_ip> <filename>")
                return
            peer_ip = parts[1]
            filename = parts[2]
            self.log_message(f"Downloading {filename} from {peer_ip}...")
            import threading
            threading.Thread(target=self._async_download, args=(peer_ip, filename), daemon=True).start()
            
        elif cmd == "myip":
            import socket
            hostname = socket.gethostname()
            ip = socket.gethostbyname(hostname)
            self.log_message(f"Local IP: {ip}")

        elif cmd == "exit":
            self.app.exit()
            
        else:
            self.log_message(f"Unknown command: {cmd}")

    def _async_list(self, peer_ip):
        if hasattr(self, 'network_manager'):
            files = self.network_manager.list_remote_files(peer_ip)
            self.app.call_from_thread(self.log_message, f"Files on {peer_ip}: {files}")

    def _async_download(self, peer_ip, filename):
        if hasattr(self, 'network_manager'):
            result = self.network_manager.download_file(peer_ip, filename)
            self.app.call_from_thread(self.log_message, result)
