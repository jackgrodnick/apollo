const express = require('express');
const app = express();
const pool = require('./db');
const PORT = 3000


// MIDDLEWARE


app.use(express.json()); // Parses req body object to JSON format


// Checks to make sure that JSON is being sent from the client, else it sends a 400 error
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) { // checks to see if conversion of req to json throws an error
      return res.status(400).json({ error: '400 Bad Request' }); // client sent non-json so send status 400 and chain json response
    }
    next();
});


// Checks to make all requests pass the correct data type for each param, else it sends a 422 error
const validateData = (req, res, next) => {
    const { vin, manufacturer, description, horse_power, model_name, model_year, purchase_price, fuel_type } = req.body;
    if (typeof vin !== 'string' || typeof manufacturer !== 'string' || typeof description !== 'string' ||
        typeof horse_power !== 'number' || typeof model_name !== 'string' || typeof model_year !== 'number' || 
        typeof purchase_price !== 'number' || typeof fuel_type !== 'string') {
        return res.status(422).json({ error: '422 Unprocessable Entity' }); // If any mismatch data types in the object, sent 422 status and json message to client
    }
    next();
}


// ROUTES


// Gets all vehicles
app.get('/vehicle', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM vehicles');
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


// Creates a new vehicle
app.post('/vehicle', validateData, async (req, res) => {
    const { vin, manufacturer, description, horse_power, model_name, model_year, purchase_price, fuel_type } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO vehicles (vin, manufacturer, description, horse_power, model_name, model_year, purchase_price, fuel_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [vin, manufacturer, description, horse_power, model_name, model_year, purchase_price, fuel_type]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
});


// Gets vehicle by VIN
app.get('/vehicle/:vin', async (req, res) => {
    const vin = req.params.vin;
    try {
      const result = await pool.query('SELECT * FROM vehicles WHERE vin = $1', [vin]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


// Updates a vehicle by vin
app.put('/vehicle/:vin', validateData, async (req, res) => {
    const vin = req.params.vin;
    const { manufacturer, description, horse_power, model_name, model_year, purchase_price, fuel_type } = req.body;
    try {
      const result = await pool.query(
        `UPDATE vehicles SET manufacturer=$2, description=$3, horse_power=$4, model_name=$5, model_year=$6, purchase_price=$7, fuel_type=$8
         WHERE vin=$1 RETURNING *`,
        [vin, manufacturer, description, horse_power, model_name, model_year, purchase_price, fuel_type]
      );
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
});


// Delete vehicle by VIN
app.delete('/vehicle/:vin', async (req, res) => {
    const vin = req.params.vin;
    try {
      await pool.query('DELETE FROM vehicles WHERE vin = $1', [vin]);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


// Start server at the specified PORT.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app; // Export app for testing file