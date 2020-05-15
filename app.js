const express = require('express');
const stripe = require('stripe')('sk_test_IctlEQfveg69zfLys1seMNWi00wyiAUteO');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const keys = require('./keys_dev');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req, res) => {
  res.render('index', {
    stripePublishableKey: keys.stripePublishableKey,
  });
});

// Charge Route
app.post('/charge', (req, res) => {
  const amount = 1200;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: 'Cup Of Coffee',
        currency: 'usd',
        customer: customer.id,
      })
    )
    .then((charge) => res.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
