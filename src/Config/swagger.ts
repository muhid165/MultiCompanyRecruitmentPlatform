import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMS BACKEND-V1 API",
      version: "1.0.0",
      description: "API documentation for the cms-backend V1",
    },
    servers: [
      {
        url: "http://192.168.0.133:5000/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Permission: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "View Users",
            },
            codename: {
              type: "string",
              example: "view_users",
            },
            description: {
              type: "string",
              example: "Allows viewing user data",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/*.ts", // JSDoc in src/api folder
  ],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
