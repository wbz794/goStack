const express = require("express");
const cors = require("cors");

const { isUuid, uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateUUid(request, response, next) {
  const { id } = request.params;
  return isUuid(id)
    ? next()
    : response.status(400).json({ error: "Inválid repository." });
}

function validateExistence(request, response, next) {
  const { id } = request.params;
  const index = repositories.findIndex((repository) => repository.id === id);

  request.body = { ...request.body, repositoryIndex: index };

  return index < 0
    ? response.status(400).json({ error: "Repository does not exist." })
    : next();
}

app.use("/repositories/:id", validateUUid);
app.use("/repositories/:id", validateExistence);

const repositories = [
  {
    id: "7392221c-1714-4341-93a7-2814d1b4c599",
    title: "Umbriel",
    url: "https://github.com/Rocketseat/umbriel",
    techs: ["Node", "Express", "TypeScript"],
    likes: 0,
  },
];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const { repositoryIndex } = request.body;

  const newRepo = { ...repositories[repositoryIndex], title, url, techs };
  repositories[repositoryIndex] = newRepo;
  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id === id);
  repositories.splice(index, 1);
  return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const { repositoryIndex } = request.body;

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1,
  };

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
