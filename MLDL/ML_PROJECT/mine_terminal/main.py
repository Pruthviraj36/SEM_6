from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Input, Static
from textual.containers import Container
from ui.world import WorldWidget
from ui.console import ConsoleWidget

class MineTerminalApp(App):
    CSS_PATH = "style.css"
    BINDINGS = [("d", "toggle_dark", "Toggle dark mode")]

    def compose(self) -> ComposeResult:
        yield Header()
        yield Container(
            WorldWidget(id="world_view"),
            ConsoleWidget(id="console_view"),
            id="main_container"
        )
        yield Footer()

    def on_mount(self) -> None:
        self.title = "Minecraft Terminal"
        self.sub_title = "File Sharing Interface"
        
        # Initialize Network Manager
        from core.network import NetworkManager
        self.network_manager = NetworkManager()
        
        # Pass network manager to console
        console = self.query_one("#console_view", ConsoleWidget)
        console.network_manager = self.network_manager
        
        # Start server
        self.network_manager.start_server(log_callback=console.log_message)

    def on_unmount(self) -> None:
        if hasattr(self, 'network_manager'):
            self.network_manager.stop()

if __name__ == "__main__":
    app = MineTerminalApp()
    app.run()
