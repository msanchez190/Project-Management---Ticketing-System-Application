'use strict';
const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');
const categoryRoutes = require('./routes/categoryRoutes');
const priorityRoutes = require('./routes/priorityRoutes');
const supportRoleRoutes = require('./routes/supportRoleRoutes');
const endUserRoutes = require('./routes/enduserRoutes')
const ticketStatusRoutes = require('./routes/supportTicketStatusRoutes')
const activeStatusRoutes = require('./routes/activeStatusRoutes')
const supportAgentRoutes = require('./routes/suportAgentRoutes')
const subCatRoutes = require('./routes/subCategoryRoutes')
const supportTicketRoutes = require('./routes/supportTicketRoutes')
const roomRoute = require('./routes/roomRoutes')
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', categoryRoutes.routes);
app.use('/api', priorityRoutes.routes);
app.use('/api', supportRoleRoutes.routes);
app.use('/api', endUserRoutes.routes);
app.use('/api', ticketStatusRoutes.routes);
app.use('/api', activeStatusRoutes.routes);
app.use('/api', supportAgentRoutes.routes)
app.use('/api', subCatRoutes.routes)
app.use('/api', supportTicketRoutes.routes)
app.use('/api', roomRoute.routes)



app.listen(config.port, () => {
  console.log('app listening on url http://localhost:' + config.port )
});