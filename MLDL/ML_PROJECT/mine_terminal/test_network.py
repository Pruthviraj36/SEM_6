import socket
import json
import time

def test_networking():
    try:
        # Wait for server to start
        time.sleep(2)
        
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(('127.0.0.1', 5000))
        
        # Test LIST command
        s.send(b"LIST")
        data = s.recv(4096).decode()
        files = json.loads(data)
        print(f"Files found: {files}")
        
        if "test_file.txt" in files:
            print("SUCCESS: test_file.txt found in list")
        else:
            print("FAILURE: test_file.txt not found")
            
        s.close()
        
        # Test GET command
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(('127.0.0.1', 5000))
        s.send(b"GET test_file.txt")
        status = s.recv(1024)
        if status == b"OK":
            content = s.recv(4096)
            print(f"File content received: {content.decode()}")
            print("SUCCESS: File download worked")
        else:
            print(f"FAILURE: Download failed with status {status}")
        s.close()
        
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_networking()
