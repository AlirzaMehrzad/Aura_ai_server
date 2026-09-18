import experss from 'express';
import dotenv from 'dotenv';
import router from './routes/routes';

dotenv.config();
const app = experss();

app.use(experss.json());

app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
