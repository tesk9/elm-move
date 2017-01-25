#!/usr/bin/env node

var moveProject = require("./scripts/project.js");

var projectPath = process.argv[2];
var destination = process.argv[3];

moveProject(projectPath, destination);
