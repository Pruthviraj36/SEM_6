import socket
import threading
import os
import json

class NetworkManager:
    def __init__(self, host='0.0.0.0', port=5000, shared_dir='shared'):
        self.host = host
        self.port = port
        self.shared_dir = shared_dir
        self.running = False
        self.server_socket = None
        
        if not os.path.exists(self.shared_dir):
            os.makedirs(self.shared_dir)

    def start_server(self, log_callback=print):
        self.running = True
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            log_callback(f"Server started on {self.host}:{self.port}")
            
            threading.Thread(target=self._accept_clients, args=(log_callback,), daemon=True).start()
        except Exception as e:
            log_callback(f"Error starting server: {e}")

    def _accept_clients(self, log_callback):
        while self.running:
            try:
                client_sock, addr = self.server_socket.accept()
                log_callback(f"Connection from {addr}")
                threading.Thread(target=self._handle_client, args=(client_sock, log_callback), daemon=True).start()
            except OSError:
                break

    def _handle_client(self, client_sock, log_callback):
        try:
            data = client_sock.recv(1024).decode()
            if not data:
                return
            
            command, *args = data.split()
            
            if command == 'LIST':
                files = os.listdir(self.shared_dir)
                client_sock.send(json.dumps(files).encode())
            
            elif command == 'GET':
                filename = args[0]
                filepath = os.path.join(self.shared_dir, filename)
                if os.path.exists(filepath):
                    client_sock.send(b"OK")
                    with open(filepath, 'rb') as f:
                        while chunk := f.read(4096):
                            client_sock.send(chunk)
                else:
                    client_sock.send(b"ERROR: File not found")
            
            elif command == 'SEND':
                # Receive file from client
                filename = args[0]
                filepath = os.path.join(self.shared_dir, filename)
                client_sock.send(b"OK")
                with open(filepath, 'wb') as f:
                    while True:
                        chunk = client_sock.recv(4096)
                        if not chunk:
                            break
                        f.write(chunk)
                log_callback(f"Received file: {filename}")

        except Exception as e:
            log_callback(f"Error handling client: {e}")
        finally:
            client_sock.close()

    def list_remote_files(self, peer_ip, peer_port=5000):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect((peer_ip, peer_port))
                s.send(b"LIST")
                data = s.recv(4096).decode()
                return json.loads(data)
        except Exception as e:
            return [f"Error: {e}"]

    def download_file(self, peer_ip, filename, peer_port=5000):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect((peer_ip, peer_port))
                s.send(f"GET {filename}".encode())
                status = s.recv(1024)
                if status == b"OK":
                    filepath = os.path.join(self.shared_dir, filename)
                    with open(filepath, 'wb') as f:
                        while True:
                            chunk = s.recv(4096)
                            if not chunk:
                                break
                            f.write(chunk)
                    return f"Downloaded {filename}"
                else:
                    return status.decode()
        except Exception as e:
            return f"Error downloading: {e}"

    def stop(self):
        self.running = False
        if self.server_socket:
            self.server_socket.close()
