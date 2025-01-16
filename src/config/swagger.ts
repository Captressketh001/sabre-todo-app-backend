import swaggerJsDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sabre Todo App API",
      version: "1.0.0",
      description: "API documentation for the Sabre Todo application",
      contact: {
        name: "Oluwakemi Omoyeni",
        email: "omoyenioluwakemi2012@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
