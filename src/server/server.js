const Koa = require('koa');
const Router = require('koa-router');
const { koaBody } = require('koa-body');
const path = require('path');
const cors = require('@koa/cors');
const fs = require('fs');
const koaStatic = require('koa-static');

const app = new Koa();
const router = new Router();
app.use(cors());
// 配置上传目录
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use(koaStatic(uploadDir));
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 200 * 1024 * 1024, // 设置最大文件大小为 200MB
        onFileBegin: (name, file) => {
            const fileName = `${Date.now()}-${file.name}`;
            file.path = path.join(uploadDir, fileName);
            file.name = fileName;
        }
    }
}));

// 上传图片的路由
router.post('/upload', koaBody(), async (ctx) => {
    console.log("handling upload");
    const file = ctx.request.files; // 获取上传的文件
    console.log('File:', file); // 打印文件信息
    if (file) {
        const fileUrl = `${ctx.origin}/${file.image.newFilename}`;
        console.log('File URL:', fileUrl); // 打印文件 URL

        ctx.body = {
            success: true,
            message: 'File uploaded successfully',
            fileUrl: fileUrl
        };
    } else {
        ctx.body = {
            success: false,
            message: 'No file uploaded',
        };
    }
});

// 使用路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});