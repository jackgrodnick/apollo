-- Commends I used for for making my sql db

CREATE DATABASE vehicle_db; -- make db to store table

\c vehicle_db; -- Switch into the new db to create the table below

-- Table I made to hold the assignments specified values for vehicles
CREATE TABLE vehicles (
  vin TEXT PRIMARY KEY, -- Ensures unique none NULL vins are inserted
  manufacturer TEXT,
  description TEXT,
  horse_power INTEGER,
  model_name TEXT, 
  model_year INTEGER,
  purchase_price DECIMAL,
  fuel_type TEXT,
  color TEXT,
  type_car TEXT
);


-- Table I made to hold the assignments specified values for vehicles
CREATE TABLE soldCars (
  vin TEXT PRIMARY KEY, -- Ensures unique none NULL vins are inserted
  buyer TEXT,
  seller TEXT,
  sellPrice DECIMAL
);