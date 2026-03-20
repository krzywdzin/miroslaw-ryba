import net from 'node:net'

export async function findAvailablePort(preferred: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(preferred, () => {
      const { port } = server.address() as net.AddressInfo
      server.close(() => resolve(port))
    })
    server.on('error', () => {
      // Preferred port in use, bind to port 0 to get any available port
      const server2 = net.createServer()
      server2.listen(0, () => {
        const { port } = server2.address() as net.AddressInfo
        server2.close(() => resolve(port))
      })
      server2.on('error', reject)
    })
  })
}
