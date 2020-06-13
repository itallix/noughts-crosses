# TicTacToe Game 10x10 with configurable win threshold

[![Build Status][noughts-crosses-travis-image] ][noughts-crosses-travis-url]
[![Codacy][noughts-crosses-codacy-image] ][noughts-crosses-codacy-url]
[![License: MIT][noughts-crosses-license-image] ][noughts-crosses-license-url]

## Run project

Server configured to run on port `8081` by default.

To run the application use: 

    ./gradlew bootRun
    
Or run script `./run.sh`

## Tech Stack

### Backend
 * JDK 11.x
 * Spring Boot 2.1.6
 * Gradle 5.4.1
 * JUnit, Mockito, Spring RestDocs MockMvc

### Frontend
 * React
 * Redux
 * Redux-actions
 * Redux-saga
 * antd

Follow the [documentation](./rest-api-docs/index.html) for the REST apis semantics.

Deployed to Heroku with Bitbucket pipeline. Access heroku app: http://jb-cross.herokuapp.com/ 

[noughts-crosses-travis-image]: https://travis-ci.com/itallix/noughts-crosses.svg?token=VccNzTqqao1HL7VwvVz1&branch=master
[noughts-crosses-travis-url]: https://travis-ci.com/github/itallix/noughts-crosses
[noughts-crosses-codacy-image]: https://app.codacy.com/project/badge/Grade/e2f0d2a0520440a691b0b0f6e7e10b0b
[noughts-crosses-codacy-url]: https://app.codacy.com/manual/itallix/noughts-crosses
[noughts-crosses-license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[noughts-crosses-license-url]: https://opensource.org/licenses/MIT
