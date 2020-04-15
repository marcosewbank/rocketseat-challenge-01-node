const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  const { title } = req.query;

  const results = title
    ? repositories.filter((repo) => repo.title.includes(title))
    : repositories;

  return res.json(results);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repo = { id: uuid(), title: title, url: url, techs: techs, likes: 0 };

  repositories.push(repo);

  return res.json(repositories);
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const likedRepoIndex = repositories.findIndex((repos) => repos.id === id);

  if (likedRepoIndex < 0) {
    return res.status(400).json({ error: "Can't find this repository" });
  }

  repositories[likedRepoIndex].likes = repositories[likedRepoIndex].likes + 1;

  return res.json(repositories[likedRepoIndex]);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;
  const repoIndex = repositories.findIndex((repos) => repos.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: "Can't find this repository" });
  }

  const repositoryData = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = repositoryData;

  return res.json(repositoryData);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: "Can't find this repository" });
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send("Repository deleted successfuly");
});

module.exports = app;
