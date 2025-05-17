const express = require('express');
const router = express.Router();
const { Blogs, HomeRemedy, Quiz, Plants, Collection, Contact, Product, User, QuizResult, HomeRemedies } = require('../models/model');

// Root Route (API base path)
router.get('/', (req, res) => {
  res.send('Welcome to the Herbal Garden API!');
});
// GET: All Quiz Data (random sample)
router.get('/alldata/quiz', async (req, res) => {
  try {
    const data = await Quiz.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz data' });
  }
});
// GET: All Blog Data
router.get('/alldata/blogs', async (req, res) => {
  try {
    const data = await Blogs.find({});
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: All Plants Data
router.get('/alldata/plants', async (req, res) => {
  try {
    const data = await Plants.find({});
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plants data' });
  }
});

// POST: Insert Contact/User (Generic handler)
router.post('/contact/insert', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    await newUser.save();
    res.json({ message: "Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to insert data" });
  }
});
router.get('/alldata/product', async (req, res) => {
 let data = await Collection.find({})
  res.status(200).json({ data: data });
})

// POST: Checkout (Dummy route for now)
router.post('/checkout/insert', (req, res) => {
  console.log(req.body);
  res.json({ message: "Data inserted successfully" });
});

// POST: Search for Products by Name
router.post('/shop/search', async (req, res) => {
  try {
    const searchData = await Product.find({ fName: req.body.name });
    res.json({ message: "data", data: searchData });
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
});

// POST: User Sign-In
router.post('/signin/user', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      return res.json({ data: user, message: "User login successfully" });
    }
    res.json({ message: "User credentials invalid" });
  } catch (error) {
    res.status(500).json({ message: "Sign-in failed" });
  }
});

// POST: User Sign-Up
router.post('/signup/user', async (req, res) => {
  try {
    const { email, password, confirmpw } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.json({ message: "User already exist" });
    if (password !== confirmpw) return res.json({ message: "Password mismatch" });

    const newUser = await User.create(req.body);
    await newUser.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Sign-up failed" });
  }
});

// POST: Insert Contact/User (Alternative Insert for Contact Form)
router.post('/contact/insert/form', async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    await newContact.save();
    res.json({ message: "Contact data inserted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to insert contact data" });
  }
});
router.get('/alldata/quiz', async (req, res) => {
  try {
    // Fetch 10 random quiz questions
    const data = await Quiz.aggregate([
      { $sample: { size: 10 } } // Fetch 10 random documents
    ]);

    res.status(200).json({ data: data });
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).json({ message: 'Error fetching quiz data' });
  }
});
router.post('/save', async (req, res) => {
  console.log('Received POST request:', req.body);
try {
  const {  userId, userName, score, totalQuestions, correctAnswers } = req.body;

  const newResult = new QuizResult({
     userId,
    userName,
    score,
    totalQuestions,
    correctAnswers
  });

  await newResult.save();
  res.status(201).json({ message: 'Quiz result saved successfully' });
} catch (error) {
  res.status(500).json({ message: 'Failed to save quiz result', error });
}
});
router.get('/alldata/homeRemedies', async (req, res) => {
  let data = await HomeRemedies.find({})
   res.status(200).json({ data: data });
 })
module.exports = router; 
