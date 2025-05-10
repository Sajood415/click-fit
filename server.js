const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

const uploadDir = path.join(__dirname, "upload_images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload_images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPEG, and JPG images are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.FILE_UPLOAD_SIZE_LIMIT) || 5 * 1024 * 1024,
  },
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
            password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
            type VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
            active TINYINT DEFAULT 1
        )`;

    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating users table:", err);
      } else {
        console.log("Users table ready");

        const createProcedureQuery = `
                CREATE PROCEDURE IF NOT EXISTS addUser(
                    IN p_email VARCHAR(255),
                    IN p_password VARCHAR(255),
                    IN p_type VARCHAR(255)
                )
                BEGIN
                    INSERT INTO users (email, password, type, active)
                    VALUES (p_email, p_password, p_type, 1);
                END
                `;

        db.query(createProcedureQuery, (err, result) => {
          if (err) {
            console.error("Error creating stored procedure:", err);
          } else {
            console.log("Stored procedure addUser created");

            db.query(
              "CALL addUser(?, ?, ?)",
              ["test@example.com", "password123", "user"],
              (err, result) => {
                if (err) {
                  console.error("Error adding test user:", err);
                } else {
                  console.log("Test user added successfully");
                }
              }
            );
          }
        });
      }
    });
  }
});

app.post("/upload", upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: file.path,
    }));

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during upload",
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
