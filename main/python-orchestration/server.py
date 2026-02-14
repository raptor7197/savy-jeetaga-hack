import socket
import ssl

HOST = "0.0.0.0"
PORT = 4433

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain("cert.pem", "key.pem")

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind((HOST, PORT))
sock.listen(1)

print("TLS Server listening...")

while True:
    conn, addr = sock.accept()
    tls_conn = context.wrap_socket(conn, server_side=True)

    print("Connected:", addr)

    data = tls_conn.recv(4096)

    print("Received (secure):")
    print(data.decode(errors="ignore"))

    tls_conn.close()
