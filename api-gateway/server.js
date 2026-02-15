require('dotenv').config();

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

/* ================================
   JWT TOKEN VERIFICATION
================================ */

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

/* ================================
   ADMIN CHECK MIDDLEWARE
================================ */

function verifyAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

/* ================================
   AUTH SERVICE ROUTES
================================ */

app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true
}));

/* ================================
   PRODUCT DELETE - ADMIN ONLY
================================ */

app.delete('/products/:id',
  verifyToken,
  verifyAdmin,
  createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true
  })
);

/* ================================
   OTHER PRODUCT ROUTES
================================ */

app.use('/products',
  verifyToken,
  createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true
  })
);

/* ================================
   SWAGGER CONFIGURATION
================================ */

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce Microservices API",
      version: "1.0.0",
      description: "API documentation for Auth and Product services"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ],
    paths: {
      "/auth/register": {
        post: {
          summary: "Register new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "User registered successfully" }
          }
        }
      },
      "/auth/login": {
        post: {
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "JWT token returned" }
          }
        }
      },
      "/products": {
        get: {
          summary: "Get all products (Token required)",
          responses: {
            200: { description: "List of products" }
          }
        },
        post: {
          summary: "Create new product (Token required)",
          responses: {
            200: { description: "Product created" }
          }
        }
      },
      "/products/{id}": {
        delete: {
          summary: "Delete product (Admin only)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Product deleted" }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ================================
   START SERVER
================================ */

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});
