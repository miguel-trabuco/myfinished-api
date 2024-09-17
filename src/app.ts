import express from 'express';

//Import types
import { Application } from 'express';

const app: Application = express();

app.listen(8090, () => {
	console.log('Server on');
});
