const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function validRepository(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository id" });
  }

  const repositoryIndex = repositories.findIndex((e) => e.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  request.locals = { repositoryIndex };

  return next();
}

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validRepository);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIndex } = request.locals;

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request.locals;

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request.locals;

  repositories[repositoryIndex].likes++;
  const { likes } = repositories[repositoryIndex];

  response.json({ likes });
});

module.exports = app;
