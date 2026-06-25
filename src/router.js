import { Router } from 'express';
const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

router.get('/status/:code', (req, res) => {
    const code = Number(req.params.code);

    res.status(code).json({
        statusCode: code,
        message: `Synthetic test response ${code}`,
        timestamp: new Date().toISOString(),
    });
});

export default router;
