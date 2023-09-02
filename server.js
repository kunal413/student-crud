const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create a Student schema and model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
});

const Student = mongoose.model('Student', studentSchema);

app.use(bodyParser.json());

// CRUD operations
// Create a new student
app.post('/students', async (req, res) => {
    try {
      const { name, age, grade } = req.body;
      const student = new Student({ name, age, grade });
      await student.save(); // Use async/await here
      res.status(201).send('Student created successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating student');
    }
  });

// Read all students
app.get('/students', async (req, res) => {
    try {
      const students = await Student.find({}).exec(); // Use async/await here
      res.status(200).json(students);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching students');
    }
  });

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    try {
      const { name, age, grade } = req.body;
      const studentId = req.params.id;
  
      const updatedStudent = await Student.findByIdAndUpdate(studentId, { name, age, grade }, { new: true });
  
      if (updatedStudent) {
        res.status(200).send('Student updated successfully');
      } else {
        res.status(404).send('Student not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating student');
    }
});

// Delete a student by ID
// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    try {
      const studentId = req.params.id;
      const deletedStudent = await Student.findByIdAndRemove(studentId);
  
      if (deletedStudent) {
        res.status(200).send('Student deleted successfully');
      } else {
        res.status(404).send('Student not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting student');
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
