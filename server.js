const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// 添加详细的错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// CORS 配置
app.use(cors({
    origin: '*'  // 在开发环境中可以使用 '*'，生产环境要设置具体域名
}));
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = 'cf6bf266-ad2f-442c-859e-52ef9dd224b5';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 测试路由
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);  // 添加服务器端日志

        const response = await axios.post(API_URL, {
            model: "deepseek-r1-250120",
            messages: [
                {
                    role: "system",
                    content: "你是一位专业的生活教练，擅长倾听、理解并给出实用的建议。"
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.6,
            stream: false
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 60000
        });

        console.log('API Response:', response.data); // 调试日志
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});