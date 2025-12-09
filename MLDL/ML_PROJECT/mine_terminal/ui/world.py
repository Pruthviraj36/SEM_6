from textual.widgets import Static
from rich.text import Text
import random
from perlin_noise import PerlinNoise

class WorldWidget(Static):
    """
    Renders a Minecraft-inspired background using ASCII/Block characters.
    """
    
    def on_mount(self) -> None:
        self.noise = PerlinNoise(octaves=10, seed=1)
        self.x_offset = 0
        self.y_offset = 0

    def render(self) -> Text:
        width = self.content_size.width or 80
        height = self.content_size.height or 24
        
        output = Text()
        
        # Simple terrain generation
        for y in range(height):
            for x in range(width):
                # Normalize coordinates for noise
                noise_val = self.noise([ (x + self.x_offset)/width, (y + self.y_offset)/height ])
                
                char = " "
                style = "white"
                
                # Map noise to terrain types
                if noise_val < -0.2:
                    char = "≈" # Water
                    style = "blue"
                elif noise_val < 0.0:
                    char = "░" # Sand
                    style = "yellow"
                elif noise_val < 0.3:
                    char = "█" # Grass
                    style = "green"
                elif noise_val < 0.5:
                    char = "▒" # Dirt/Mountain base
                    style = "#8B4513" # SaddleBrown
                else:
                    char = "▲" # Mountain peak
                    style = "#808080"

                output.append(char, style=style)
            output.append("\n")
            
        return output

    def on_resize(self, event) -> None:
        self.refresh()
