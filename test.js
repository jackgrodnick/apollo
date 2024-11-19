const request = require('supertest'); // simulates http requests for testing
const app = require('./index'); // API server import
const pool = require('./db'); // sql client connection

// example data
const testData = [
  {
  vin: '4Y1SL65848Z411439',
  manufacturer: 'Tesla',
  description: 'A Car Jack Grodnick Loves!',
  horse_power: 10000,
  model_name: 'Cybertruck',
  model_year: 2024,
  purchase_price: 100000.99,
  fuel_type: 'Electric'
},
{
  vin: '123123123',
  manufacturer: 'Tesla!',
  description: 'A cool car!',
  horse_power: 10000,
  model_name: 'Model Y',
  model_year: 2023,
  purchase_price: 50000.99,
  fuel_type: 'Electric/Gas' // Just for testing new value
}
];

// Clear database after each test by deleting all rows
afterEach(async () => {
  await pool.query('DELETE FROM vehicles');
});

describe('Test all Vehicle API Endpoints', () => {

  // First: GET /vehicle which fetch all vehicles
  it('fetch all vehicles', async () => {
    const response = await request(app).get('/vehicle');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Second: GET /vehicle which fetch all vehicles after posting 2 new ones.
  it('fetch all vehicles multi test', async () => {

    // Post the first vehicle
    await request(app)
    .post('/vehicle')
    .send(testData[0]);

    // Post the second vehicle
    await request(app)
    .post('/vehicle')
    .send(testData[1]);

    // Fetch all vehicles
    const response = await request(app).get('/vehicle');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2); // checks to see if both vehicles are present
  });

  // Third: POST /vehicle which creates a new vehicle
  it('create a new vehicle', async () => {
    const response = await request(app)
    .post('/vehicle')
    .send(testData[0]);

    expect(response.statusCode).toBe(201);
    expect(response.body.vin).toBe(testData[0].vin);
  });

    // Fourth: POST /vehicle which creates 2 new vehicles
  it('create a new vehicle multi test', async () => {
    const response1 = await request(app)
    .post('/vehicle')
    .send(testData[0]);

    const response2 = await request(app)
    .post('/vehicle')
    .send(testData[1]);
  
    expect(response1.statusCode).toBe(201);
    expect(response1.body.vin).toBe(testData[0].vin);

    expect(response2.statusCode).toBe(201);
    expect(response2.body.vin).toBe(testData[1].vin);
  });

  // Fifth: GET /vehicle/:vin testing with 2 different fetches
  it('fetch a vehicle by VIN multi test', async () => {
    await request(app).post('/vehicle').send(testData[0]);
    const response1 = await request(app).get(`/vehicle/${testData[0].vin}`);

    await request(app).post('/vehicle').send(testData[1]);
    const response2 = await request(app).get(`/vehicle/${testData[1].vin}`);

    expect(response1.statusCode).toBe(200);
    expect(response1.body.vin).toBe(testData[0].vin);
    expect(response1.body.manufacturer).toBe(testData[0].manufacturer);

    expect(response2.statusCode).toBe(200);
    expect(response2.body.vin).toBe(testData[1].vin);
    expect(response2.body.manufacturer).toBe(testData[1].manufacturer);
  });

  // sixth: PUT /vehicle/:vin testing with two different props and objects
  it('update a vehicle by VIN multi test', async () => {
    await request(app).post('/vehicle').send(testData[0]);
    await request(app).post('/vehicle').send(testData[1]);

    const updatedData1 = { ...testData[0], horse_power: 500 };

    const updatedData2 = { ...testData[1], model_name: "Roadster" };

    const response1 = await request(app)
    .put(`/vehicle/${testData[0].vin}`)
    .send(updatedData1);

      const response2 = await request(app)
      .put(`/vehicle/${testData[1].vin}`)
      .send(updatedData2);


    expect(response1.statusCode).toBe(200);
    expect(response1.body.horse_power).toBe(500);


    expect(response2.statusCode).toBe(200);
    expect(response2.body.model_name).toBe("Roadster");
  });

  // Seventh: DELETE /vehicle/:vin which should delete a vehicle by vin
  it('delete a vehicle by VIN', async () => {
    await request(app).post('/vehicle').send(testData[0]);
    const response = await request(app).delete(`/vehicle/${testData[0].vin}`);

    expect(response.statusCode).toBe(204);
    
    const response2 = await request(app).get(`/vehicle/${testData[0].vin}`);
    expect(response2.statusCode).toBe(404); // Check if the vehicle is really deleted
  });

  // Eighth: test missing VIN response
  it('return 404 if vehicle not found', async () => {
    const response = await request(app).get('/vehicle/Missing');
    expect(response.statusCode).toBe(404);
  });

  // Ninth: client sends invalid data test
  it('return 422 for invalid data multi test', async () => {
    const invalidData = { ...testData[0], vin: null }; // sends null type as vin which is not allowed
    const response = await request(app).post('/vehicle').send(invalidData);
    expect(response.statusCode).toBe(422);

    const invalidData2 = { ...testData[1], manufacturer: 123 }; // sends number instead of string for manu which is not allowed
    const response2 = await request(app).post('/vehicle').send(invalidData2);
    expect(response2.statusCode).toBe(422);

  });

    // Ninth: client sends invalid data test
    it('return 422 for invalid data multi test', async () => {
      const response = await request(app).post('/vehicle').send(testData[0]);

      const response = await request(app).post('/soldv').send(testData[0]);
  
      const response2 = await request(app).get('/getsoldvehicles').send(invalidData2);
      
      expect(response2.statusCode).toBe(422);
  
    });

  // Tenth: Test for client sending invalid JSON format
  it('return 400 for invalid JSON format', async () => {
    const response = await request(app)
    .post('/vehicle')
    .set('Content-Type', 'application/json')
      // missing bracket at the end of object
    .send("{vin: '4Y1SL65848Z411439', manufacturer: 'Tesla', description: 'A Car Jack Grodnick Loves!', horse_power: 10000, model_name: 'Cybertruck', model_year: 2024, purchase_price: 100000.99, fuel_type: 'Electric'");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('400 Bad Request');
  });
});
