'use strict';

var _ = require('lodash');

var controllerHelper = require('../helpers/controller.helper');
var messageHelper = require('../helpers/message.helper');
var gamesystemService = require('../services/gamesystem.service');

const { Gamesystems } = require('../models');// Sequelize
////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

// Module Name
const MODULE_NAME = '[GameSystem Controller]';

// Error Messages
const GS_CT_ERR_GAMESYSTEM_NOT_FOUND = 'Gamesystem not found';

// Success Messages
const GS_CT_DELETED_SUCCESSFULLY = 'Gamesystem deleted successfully';

////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
////////////////////////////////////////////////////////////////////////////////

function getGameSystems(req, res) {
  try {
    console.log("gamesystems...");
    console.log(Gamesystems);
    Gamesystems.findAll({
      /*include: [{
        model: orderstatus
      }]
      include: [{ all: true, nested: true }]*/
    }).then((consoles) => {
      console.log(consoles);
      res.status(200).send(consoles);
      //utils.writeJson(res, consoles);
    }, (error) => {res.status(500).send(error);
    });
  } catch (error) {
    controllerHelper.handleErrorResponse(MODULE_NAME, getGameSystems.name, error, res);
  }
}

function getGameSystemById(req, res) {
  try {
    
    console.log(req.swagger.params.id.value);

    var id = req.swagger.params.id.value;

    console.log("gamesystem by id..." + id);
    //console.log(gamesystems);
    Gamesystems.findByPk(id)
    .then(mygamesystem => {
    console.log(mygamesystem);
    res.status(200).send(mygamesystem);})
    } catch (error) {
    console.log("Was an error");
    controllerHelper.handleErrorResponse(MODULE_NAME, getGameSystembyId.name, error,
    res);
    }
}

function createGameSystem(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  try {
    console.log("params : ");
    var mygamesystem = req.body;
    console.log("gamesystems ... " + mygamesystem);
    return Gamesystems
    .create({
      name: mygamesystem.name,
      description: mygamesystem.description,
    }, {
      /* include: [{
        model: order_detail,
        as: 'orderdetail'
      }] */
    })
    .then((mygamesystem) => {
      res.status(201).send(mygamesystem);
    })
    .catch((error) => res.status(400).send(error));
  } catch (error) {
    console.log("Was an error");
    controllerHelper.handleErrorResponse(MODULE_NAME, createGameSystem.name, error, res);
  }
}

function updateGameSystem(req, res) {
  
  try {
    // Receiving parameters
    var params = {
      id: req.swagger.params.id.value
    };
    _.assign(params, req.body);
    
    // Call to service
    var result = gamesystemService.updateGameSystem(params);
    
    // Returning the result
    if (!_.isUndefined(result) && _.isUndefined(result.error)) {
      res.json(result);
    } else {
      res.status(409).json(messageHelper.buildMessage(result.error));
    }
  } catch (error) {
    controllerHelper.handleErrorResponse(MODULE_NAME, updateGameSystem.name, error, res);
  }
}

function deleteGameSystem(req, res) {
  
  try {
    // Receiving parameters
    var params = {
      id: req.swagger.params.id.value
    };
    
    // Call to service
    var result = gamesystemService.deleteGameSystem(params.id);
    
    // Returning the result
    if (!_.isUndefined(result) && _.isUndefined(result.error)) {
      res.json(messageHelper.buildMessage(GS_CT_DELETED_SUCCESSFULLY));
    } else {
      res.status(404).json(messageHelper.buildMessage(result.error));
    }
  } catch (error) {
    controllerHelper.handleErrorResponse(MODULE_NAME, createGameSystem.name, error, res);
  }
}

module.exports = {
  getGameSystems,
  getGameSystemById,
  createGameSystem,
  updateGameSystem,
  deleteGameSystem,
  GS_CT_ERR_GAMESYSTEM_NOT_FOUND,
  GS_CT_DELETED_SUCCESSFULLY,
  MODULE_NAME
}