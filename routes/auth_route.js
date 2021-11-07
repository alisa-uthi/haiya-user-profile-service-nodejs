const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const authService = require("../services/auth_service");

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const result = await authService.signup(req);
    const token = jwt.sign({ userId: result.ID }, process.env.JWT_SECRET);
    result.token = token;

    res.status(201).json({ message: "Sign up successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign in
router.post("/signin", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (user) {
      const token = jwt.sign({ userId: user.ID }, process.env.JWT_SECRET);
      return res.status(200).json({ user, token });
    } else {
      return res.status(422).json({ error: info });
    }
  })(req, res, next);
});

// Request reset password
router.post("/request-reset-password", async (req, res) => {
  try {
    const messageId = await authService.requestPasswordReset(req.body.email);
    if (messageId) {
      return res.status(200).json({
        message: "Your password reset request has been sent.",
        messageId,
      });
    }
    res.status(500).json({ error: "Unable to request password reset." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset password
router.post("/:userId/reset-password", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  const { token, password } = req.body;

  try {
    const messageId = await authService.resetPassword(
      req.params.userId,
      token,
      password
    );
    if (messageId) {
      return res.status(200).json({
        message: "Your password has been changed.",
        messageId,
      });
    }
    res.status(500).json({ error: "Unable to reset password." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
