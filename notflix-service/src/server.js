const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

// Register CORS
fastify.register(require('@fastify/cors'), {
    origin: '*' // In production, this should be restricted
});

// Register Static
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../frontend'),
    prefix: '/', // optional: default '/'
});

fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

fastify.head('/video', async (request, reply) => {
    console.log("HEAD request received");
    const videoPath = path.join(__dirname, '../som3.mp4');
    try {
        const stat = fs.statSync(videoPath);
        const headers = {
            "Content-Length": stat.size,
            "Content-Type": "video/mp4",
            "Accept-Ranges": "bytes" // Important for browsers to know we support range requests
        };
        reply.headers(headers).code(200).send();
    } catch (err) {
        request.log.error(err);
        reply.code(404).send();
    }
});

fastify.get('/video', async (request, reply) => {
    const range = request.headers.range;
    const videoPath = path.join(__dirname, '../som3.mp4');

    if (!range) {
        return reply.code(400).send("Requires Range header");
    }

    try {
        const videoStats = fs.statSync(videoPath);
        const videoSize = videoStats.size;

        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // Create headers
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        reply.code(206).headers(headers);

        const videoStream = fs.createReadStream(videoPath, { start, end });
        return videoStream;

    } catch (err) {
        request.log.error(err);
        return reply.code(404).send("Video not found");
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 8000 });
        console.log("Listening on port 8000!");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
