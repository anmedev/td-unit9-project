//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-IMPORTS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

const express = require('express');
const router = express.Router();
const Course = require("./models").Course;
const User = require("./models").User;
const {authenticateUser} = require("./middleware/auth-user");

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-ASYNC ERROR HANDLER-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        // Forward error to the global error handler
        next(error);
      }
    }
  }

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-USER ROUTES-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

// Route that returns the currently authenticated user.
router.get("/users", authenticateUser, asyncHandler(async (req, res)=> {
  let users = await User.findAll();
  res.json(users); 
  const user = req.user;
  onsole.log(user.emailAddress);

  res.json({
    username: user.emailAddress,
    name: `${user.firstName} ${user.lastName}`
  });
  c
}));

// Route that creates a user.
router.post("/users", asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).location('/').end();
  } catch (error) {
    console.log('ERROR: ', error.name);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-COURSE ROUTES-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

// Route that returns all courses and the users associated with the course.
router.get("/courses", asyncHandler(async (req, res)=> {
  let courses = await Course.findAll({
    include: [{model: User}],
  });
  res.json(courses);
}));

// Route that returns a specific course and the users associated with the course.
router.get("/courses/:id", asyncHandler(async (req, res)=> {
  const course = await Course.findByPk(req.params.id, {
    include: [{model: User}],
  });
  if (course) {
    res.json(course);
  }
}));

// Route that creates a new course and adds it to the list of courses.
router.post("/courses", asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body);
    res.status(201).location('/courses').end();
  } catch (error) {
    console.log('ERROR: ', error.name);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route that updates an existing course.
router.put("/courses/:id", asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{model: User}],
  });
  try {
  if (course) {
    await course.update(req.body);
    res.status(204).end();
  }
  } catch (error) {
    console.log('ERROR: ', error.name);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route that deletes an existing course.
router.delete("/courses/:id", asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{model: User}],
  });
  if (course) {
    await course.destroy();
    res.status(204).end();
  }
}));

module.exports = router;