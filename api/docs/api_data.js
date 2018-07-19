define({ "api": [
  {
    "type": "get",
    "url": "/brands",
    "title": "List all the brands",
    "name": "GetBrandsList",
    "group": "Brand",
    "description": "<p>Return the list of all the brands. No parameters are required for this endpoint.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Brand[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Array of brands</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"name\": \"nespresso\",\n        \"displayName\": \"Nespresso\",\n        \"logoUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Nespresso-logo.svg/320px-Nespresso-logo.svg.png\"\n    },\n    {\n        \"name\": \"tagheuer\",\n        \"displayName\": \"Tag Heuer\",\n        \"logoUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/TAG_HEUER_logo.svg/500px-TAG_HEUER_logo.svg.png\"\n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.brand.js",
    "groupTitle": "Brand",
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/brands/:brandSlug/blocks",
    "title": "Get brand blocks",
    "name": "GetBrandBlocks",
    "group": "Campaigns",
    "description": "<p>Return the list of all the blocks in the brand. No parameters are required for this endpoint.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Blocks[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Array of blocks</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"name\": \"blockName\",\n        \"displayName\": \"Block Name\",\n        \"thumbnailUrl\": \"/public/brand/images/img.jpg\",\n        \"properties\": [...]\n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingBlocks",
            "description": "<p>Something unexpected happened while reading the blocks configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorReadingBlocks:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while reading the blocks configuration file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "get",
    "url": "/brands/:brandSlug/campaigns",
    "title": "List all the campaigns",
    "name": "GetCampaignsList",
    "group": "Campaigns",
    "description": "<p>Return the list of all the campaigns. No parameters are required for this endpoint.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Campaign[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Array of campaigns</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n     \"name\": \"campagneDeDemonstration\",\n      \"displayName\": \"Campagne de démonstration\",\n      \"createdAt\": \"2018-07-06T06:49:37.531Z\"\n  },\n  {\n      \"name\": \"nouvelleNewsletter\",\n      \"displayName\": \"Nouvelle Newsletter\",\n      \"createdAt\": \"2018-07-10T14:11:24.148Z\"\n  },\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns",
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/blocks",
    "title": "Add block data",
    "name": "addBlockData",
    "group": "Campaigns",
    "description": "<p>Add block data to the campaign.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "BlockData",
            "optional": false,
            "field": "blockData",
            "description": "<p>Block data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "BlockData",
            "optional": false,
            "field": "Object",
            "description": "<p>Block data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"blockName\": \"header-02-1531231935137\",\n    \"languages\": [\n        {\n            \"lang\": \"fr\",\n            \"properties\": [\n                {\n                    \"name\": \"img\",\n                    \"value\": \"/dist/brandName/demo/images/uploads/logo.png\",\n                    \"copiedFromMaster\": false\n                },\n                {\n                    \"name\": \"url\",\n                    \"value\": \"http://www.wideagency.com/\",\n                    \"copiedFromMaster\": false\n                }\n            ],\n            \"display\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "WrongParameter",
            "description": "<p>You must pass the block data in the body.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BlockNotFound",
            "description": "<p>The block you are trying to update does not exist.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingDataFile",
            "description": "<p>Something unexpected happened while reading the campaign data file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "WrongParameter:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"You must pass the block data in the body.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingDataFile:",
          "content": "HTTP/1.1 500 internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign data file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "BlockNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n     \"error\": {\n         \"status\": 404,\n         \"message\": [\n             \"The block you are trying to update does not exist.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns",
    "title": "Add a new campaign",
    "name": "addCampaign",
    "group": "Campaigns",
    "description": "<p>Add a new campaign.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>Name of the campaign to be created.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Campaign",
            "optional": false,
            "field": "Object",
            "description": "<p>Campaign created</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"name\": \"nouvelleNewsletter\",\n    \"displayName\": \"Nouvelle Newsletter\",\n    \"createdAt\": \"2018-07-10T14:11:24.148Z\"\n},",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "DisplayNameInvalid",
            "description": "<p>Enter a valid display name.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "MasterDuplicationError",
            "description": "<p>An error occured while trying to duplicate the master template.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "CampainsFileNotFound",
            "description": "<p>The file 'campaigns.json' does not exist.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "RenamingStylesheetError",
            "description": "<p>An error occured while renaming the scss file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingLayoutFile",
            "description": "<p>An error occured while reading the layout file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingLayoutFile",
            "description": "<p>An error occured while writing the layout file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DisplayNameInvalid:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"Enter a valid displayName.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "MasterDuplicationError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while trying to duplicate the master template.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "CampainsFileNotFound:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"The file 'campaigns.json' does not exist.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "RenamingStylesheetError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while renaming the scss file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingLayoutFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while reading the layout file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorWritingLayoutFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while writing the layout file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "delete",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/archive",
    "title": "Archive a campaign",
    "name": "archiveCampaign",
    "group": "Campaigns",
    "description": "<p>Archive a campaign. An archived campaign can be restored. If you want to restore an archived campaign, please contact the server administrator.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HttpRequestSuccess",
            "optional": false,
            "field": "Success",
            "description": "<p>Success 200</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "text"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorArchive",
            "description": "<p>Something unexpected happened while moving the campaign to the archive folder.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingCampaignFile",
            "description": "<p>An error occured while writing the campaigns file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorArchive:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while moving the campaign to the archive folder.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorWritingCampaignFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while writing the campaigns file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/build",
    "title": "Build the campaign",
    "name": "buildCampaign",
    "group": "Campaigns",
    "description": "<p>Build the campaign.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Links to the previews</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"url\": \"http://yourserverurl.com/dist/brand/campaign/index-fr.html\",\n        \"lang\": \"fr\"    \n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns",
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "TaskExecutionErrorWithCode",
            "description": "<p>Something unexpected happened while executing the task. The task closed with error code '%code%'</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "TaskExecutionError",
            "description": "<p>Something unexpected happened while executing the task.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "CompilationError",
            "description": "<p>Something unexpected happened while reading the campaign configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingStructure",
            "description": "<p>Something unexpected happened while reading the campaign structure file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingData",
            "description": "<p>Something unexpected happened while reading the campaign data file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorRenderingStructure",
            "description": "<p>Something unexpected happened while rendering the campaign structure file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorSavingStructure",
            "description": "<p>Something unexpected happened while writing the file 'index-%lang%.html'.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorRenderingData",
            "description": "<p>Something unexpected happened while rendering the campaign data files.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorSavingData",
            "description": "<p>Something unexpected happened while writing the file  'lang-%lang%.yml'.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "TaskExecutionErrorWithCode:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while executing the task. The task closed with error code '%code%'\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "TaskExecutionError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while executing the task.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "CompilationError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign configuration file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign data file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorSavingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while writing the file 'index-%lang%.html'.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign data files.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorSavingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while writing the file  'lang-%lang%.yml'.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/delete",
    "title": "Delete a campaign",
    "name": "deleteCampaign",
    "group": "Campaigns",
    "description": "<p>Delete a campaign. Be aware, a deleted campaign cannot be restored.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HttpRequestSuccess",
            "optional": false,
            "field": "Success",
            "description": "<p>Success 200</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "text"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingCampaignFile",
            "description": "<p>An error occured while writing the campaigns file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWritingCampaignFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while writing the campaigns file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/duplicate",
    "title": "Duplicate a campaign",
    "name": "duplicateCampaign",
    "group": "Campaigns",
    "description": "<p>Duplicate a campaign.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>Name of the campaign duplicate.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Campaign",
            "optional": false,
            "field": "Object",
            "description": "<p>New campaign created</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"name\": \"duplicateACampaign\",\n    \"displayName\": \" Duplicate a campaign\",\n    \"createdAt\": \"2018-07-10T14:11:24.148Z\"\n},",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "DisplayNameInvalid",
            "description": "<p>Enter a valid display name.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "CampaignNotFound",
            "description": "<p>The campaign given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "DuplicateCampaignError",
            "description": "<p>An error occured while trying to duplicate the campaign.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "CampainsFileNotFound",
            "description": "<p>The file 'campaigns.json' does not exist.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "RenamingStylesheetError",
            "description": "<p>An error occured while renaming the scss file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingLayoutFile",
            "description": "<p>An error occured while reading the layout file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingLayoutFile",
            "description": "<p>An error occured while writing the layout file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DisplayNameInvalid:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"Enter a valid displayName.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "DuplicateCampaignError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while trying to duplicate the campaign.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "CampainsFileNotFound:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"The file 'campaigns.json' does not exist.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "RenamingStylesheetError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while renaming the scss file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingLayoutFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while reading the layout file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorWritingLayoutFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while writing the layout file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        },
        {
          "title": "CampaignNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The campaign with the name '%campaignName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "get",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/blocks/:blockName",
    "title": "Get block data by name",
    "name": "getBlockDataByName",
    "group": "Campaigns",
    "description": "<p>Get the block data for a certain block.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "BlockData",
            "optional": false,
            "field": "Object",
            "description": "<p>Block data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"blockName\": \"header-02-1531231935137\",\n    \"languages\": [\n        {\n            \"lang\": \"fr\",\n            \"properties\": [\n                {\n                    \"name\": \"img\",\n                    \"value\": \"/dist/brandName/demo/images/uploads/logo.png\",\n                    \"copiedFromMaster\": false\n                },\n                {\n                    \"name\": \"url\",\n                    \"value\": \"http://www.wideagency.com/\",\n                    \"copiedFromMaster\": false\n                }\n            ],\n            \"display\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingDataFile",
            "description": "<p>Something unexpected happened while reading the campaign data file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorReadingDataFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign data file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "get",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/blocks",
    "title": "Get campaign blocks data",
    "name": "getCampaignBlocksData",
    "group": "Campaigns",
    "description": "<p>Get the data from all the blocks in the campaign.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "BlockData[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Data of the newsletter</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"blockName\": \"header-02-1531231935137\",\n        \"languages\": [\n            {\n                \"lang\": \"fr\",\n                \"properties\": [\n                    {\n                        \"name\": \"img\",\n                        \"value\": \"/dist/brandName/demo/images/uploads/logo.png\",\n                        \"copiedFromMaster\": false\n                    },\n                    {\n                        \"name\": \"url\",\n                        \"value\": \"http://www.wideagency.com/\",\n                        \"copiedFromMaster\": false\n                    }\n                ],\n                \"display\": true\n            }\n        ]\n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingDataFile",
            "description": "<p>Something unexpected happened while reading the campaign data file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorReadingDataFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign data file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "get",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug",
    "title": "Get campaign config",
    "name": "getCampaignConfig",
    "group": "Campaigns",
    "description": "<p>Get the campaign configuration such as the campaign languages, the emails subjects, etc.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "CampaignConfig",
            "optional": false,
            "field": "Object",
            "description": "<p>Campaign configuration</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"lang\": {\n        \"fr\": {\n            \"subject\": \"Sujet en FR\"\n        },\n        \"de\": {\n            \"subject\": \"Sujet en DE\"\n        },\n        \"fr-CH\": {\n            \"subject\": \"Sujet en fr-CH\"\n        }\n    },\n    \"customLang\": ['fr-CH'],\n    \"masterLang\": \"fr\",\n    \"layout\": \"default\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingConfigurationFile",
            "description": "<p>An error occured while reading the campaign configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorReadingConfigurationFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign configuration file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "get",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/structure",
    "title": "Get campaign structure",
    "name": "getCampaignStructure",
    "group": "Campaigns",
    "description": "<p>Get the campaign structure</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "BlockPosition[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Structure of the newsletter</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"blockType\": \"header-01\",\n        \"position\": 0,\n        \"name\": \"header-01-1531231933395\",\n        \"valid\": true\n    },\n    {\n        \"blockType\": \"header-02\",\n        \"position\": 1,\n        \"name\": \"header-02-1531231935137\",\n        \"valid\": true\n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingStructureFile",
            "description": "<p>Something unexpected happened while reading the campaign structure file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorReadingStructureFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "delete",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/blocks/:blockName",
    "title": "Remove block data",
    "name": "removeBlockData",
    "group": "Campaigns",
    "description": "<p>Remove the block data.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HttpRequestSuccess",
            "optional": false,
            "field": "Success",
            "description": "<p>Success 200</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingData",
            "description": "<p>Something unexpected happened while reading the campaign data file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BlockNotFound",
            "description": "<p>The block you are trying to remove does not exist.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorReadingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign data file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "BlockNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n     \"error\": {\n         \"status\": 404,\n         \"message\": [\n             \"The block you are trying to remove does not exist.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "patch",
    "url": "/brands/:brandSlug/campaigns",
    "title": "Rename a campaign",
    "name": "renameCampaign",
    "group": "Campaigns",
    "description": "<p>Rename an existing campaign.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>New name of the campaign.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Campaign",
            "optional": false,
            "field": "Object",
            "description": "<p>Campaign updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"name\": \"nouvelleNewsletter\",\n    \"displayName\": \"Nouveau nom de la campagne\",\n    \"createdAt\": \"2018-07-10T14:11:24.148Z\"\n},",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "DisplayNameInvalid",
            "description": "<p>Enter a valid display name.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "CampaignNotFound",
            "description": "<p>The campaign given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingCampaignFile",
            "description": "<p>An error occured while writing the campaign file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DisplayNameInvalid:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"Enter a valid displayName.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorWritingCampaignFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"An error occured while writing the campaign file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        },
        {
          "title": "CampaignNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The campaign with the name '%campaignName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "put",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/blocks",
    "title": "Set blocks data",
    "name": "setBlocksData",
    "group": "Campaigns",
    "description": "<p>Set blocks data. Be aware, this function will overide all the data previously saved.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "BlockData[]",
            "optional": false,
            "field": "blocksData",
            "description": "<p>Blocks data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "BlockData[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Blocks data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"blockName\": \"header-02-1531231935137\",\n        \"languages\": [\n            {\n                \"lang\": \"fr\",\n                \"properties\": [\n                    {\n                        \"name\": \"img\",\n                        \"value\": \"/dist/brandName/demo/images/uploads/logo.png\",\n                        \"copiedFromMaster\": false\n                    },\n                    {\n                        \"name\": \"url\",\n                        \"value\": \"http://www.wideagency.com/\",\n                        \"copiedFromMaster\": false\n                    }\n                ],\n                \"display\": true\n            }\n        ]\n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "WrongParameter",
            "description": "<p>You must pass an array of blocks data in the body.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "WrongParameter:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"You must pass an array of blocks data in the body.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug",
    "title": "Set campaign config",
    "name": "setCampaignConfig",
    "group": "Campaigns",
    "description": "<p>Set the campaign configuration such as the campaign languages, the emails subjects, etc.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "campaignConfig",
            "description": "<p>Campaign configuration</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "CampaignConfig",
            "optional": false,
            "field": "Object",
            "description": "<p>New campaign configuration</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"lang\": {\n        \"fr\": {\n            \"subject\": \"Sujet en FR\"\n        },\n        \"de\": {\n            \"subject\": \"Sujet en DE\"\n        },\n        \"fr-CH\": {\n            \"subject\": \"Sujet en fr-CH\"\n        }\n    },\n    \"customLang\": ['fr-CH'],\n    \"masterLang\": \"fr\",\n    \"layout\": \"default\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingConfigurationFile",
            "description": "<p>Something unexpected happened while writing the campaign configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWritingConfigurationFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while writing the campaign configuration file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/structure",
    "title": "Set the campaign structure",
    "name": "setCampaignStructure",
    "group": "Campaigns",
    "description": "<p>Set the campaign structure</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "BlockPosition[]",
            "optional": false,
            "field": "campaignStructure",
            "description": "<p>Structure of the newsletter</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "BlockPosition[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Structure of the newsletter</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"blockType\": \"header-01\",\n        \"position\": 0,\n        \"name\": \"header-01-1531231933395\",\n        \"valid\": true\n    },\n    {\n        \"blockType\": \"header-02\",\n        \"position\": 1,\n        \"name\": \"header-02-1531231935137\",\n        \"valid\": true\n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "WrongParameter",
            "description": "<p>You must pass an array of Object in the request body.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "BlockNotFound",
            "description": "<p>The block does not exist.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "BlockPositionError",
            "description": "<p>Two blocks are at the same position.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "BlockUniqueIdentifierError",
            "description": "<p>Two blocks have the same name.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingBlocksConfig",
            "description": "<p>Something unexpected happened while reading the blocks configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingCampaignConfig",
            "description": "<p>Something unexpected happened while reading the campaign configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingStructureFile",
            "description": "<p>Something unexpected happened while writing the campaign structure file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "WrongParameter:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"You must pass an array of Object in the request body.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingBlocksConfig:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the blocks configuration file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingCampaignConfig:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign configuration file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "BlockNotFound:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"The block '%blockName%' does not exist.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "BlockPositionError:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"Two blocks are at the same position.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "BlockUniqueIdentifierError:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": [\n             \"Two blocks have the same name.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorWritingStructureFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while writing the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/zip",
    "title": "Zip the campaign",
    "name": "zipCampaign",
    "group": "Campaigns",
    "description": "<p>Zip the campaign.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Object",
            "description": "<p>Link to the zip file</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"zipLink\": \"http://yourserverurl.com/dist/brand_campaign.zip\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "TaskExecutionErrorWithCode",
            "description": "<p>Something unexpected happened while executing the task. The task closed with error code '%code%'</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "TaskExecutionError",
            "description": "<p>Something unexpected happened while executing the task.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "CompilationError",
            "description": "<p>Something unexpected happened while reading the campaign configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingStructure",
            "description": "<p>Something unexpected happened while reading the campaign structure file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingData",
            "description": "<p>Something unexpected happened while reading the campaign data file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorRenderingStructure",
            "description": "<p>Something unexpected happened while rendering the campaign structure file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorSavingStructure",
            "description": "<p>Something unexpected happened while writing the file 'index-%lang%.html'.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorRenderingData",
            "description": "<p>Something unexpected happened while rendering the campaign data files.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorSavingData",
            "description": "<p>Something unexpected happened while writing the file  'lang-%lang%.yml'.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "TaskExecutionErrorWithCode:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while executing the task. The task closed with error code '%code%'\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "TaskExecutionError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while executing the task.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "CompilationError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign configuration file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign data file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorSavingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while writing the file 'index-%lang%.html'.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign data files.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorSavingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while writing the file  'lang-%lang%.yml'.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.campaign.js",
    "groupTitle": "Campaigns"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/recipients",
    "title": "Add a recipient",
    "name": "addRecipient",
    "group": "Emails",
    "description": "<p>Return the recipient created.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Recipient",
            "optional": false,
            "field": "recipient",
            "description": "<p>Recipient to be created.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Recipient",
            "optional": false,
            "field": "Object",
            "description": "<p>Recipient created</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"firstname\": \"John\",\n    \"lastname\": \"Doe\",\n    \"email\": \"john.doe@domain.com\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "WrongParameter",
            "description": "<p>Please send a recipient in the body parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingRecipients",
            "description": "<p>Something unexpected happened while reading the brand recipients file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingRecipients",
            "description": "<p>Something unexpected happened while writing the brand recipients file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "WrongParameter:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": \"Please send a recipient in the body parameters.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingRecipients:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while reading the brand recipients file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorWritingRecipients:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while writing the brand recipients file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.email.js",
    "groupTitle": "Emails"
  },
  {
    "type": "get",
    "url": "/brands/:brandSlug/recipients",
    "title": "Get recipients list",
    "name": "getRecipientsList",
    "group": "Emails",
    "description": "<p>Return the brand's recipients list. No parameters are required for this endpoint.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Recipient[]",
            "optional": false,
            "field": "Object",
            "description": "<p>Array of recipients</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"firstname\": \"John\",\n        \"lastname\": \"Doe\",\n        \"email\": \"john.doe@domain.com\"\n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingRecipients",
            "description": "<p>Something unexpected happened while reading the brand recipients file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorReadingRecipients:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while reading the brand recipients file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.email.js",
    "groupTitle": "Emails"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/send",
    "title": "Send a campaign",
    "name": "sendCampaign",
    "group": "Emails",
    "description": "<p>Build a campaign and send it by email to the selected recipients in the given languages.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string[]",
            "optional": false,
            "field": "recipients",
            "description": "<p>Array of recipients email addresses</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HttpRequestSuccess",
            "optional": false,
            "field": "Success",
            "description": "<p>Success 200</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "text"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "WrongParameter",
            "description": "<p>Please send the recipients in the body parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "InvalidLanguages",
            "description": "<p>Some of the languages given in the body parameters are invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "InvalidEmails",
            "description": "<p>The email addresses provided are invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingConfig",
            "description": "<p>Something unexpected happened while reading the campaign configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingHtmlFile",
            "description": "<p>Something unexpected happened while reading the email html file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorSendingEmails",
            "description": "<p>Something unexpected happened while sending the test emails. Please try again later.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "TaskExecutionErrorWithCode",
            "description": "<p>Something unexpected happened while executing the task. The task closed with error code '%code%'</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "TaskExecutionError",
            "description": "<p>Something unexpected happened while executing the task.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "CompilationError",
            "description": "<p>Something unexpected happened while reading the campaign configuration file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingStructure",
            "description": "<p>Something unexpected happened while reading the campaign structure file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingData",
            "description": "<p>Something unexpected happened while reading the campaign data file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorRenderingStructure",
            "description": "<p>Something unexpected happened while rendering the campaign structure file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorSavingStructure",
            "description": "<p>Something unexpected happened while writing the file 'index-%lang%.html'.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorRenderingData",
            "description": "<p>Something unexpected happened while rendering the campaign data files.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorSavingData",
            "description": "<p>Something unexpected happened while writing the file  'lang-%lang%.yml'.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "WrongParameter:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": \"Please send the recipients in the body parameters.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingConfig:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while reading the campaign configuration file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "InvalidLanguages:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": \"Some of the languages given in the body parameters are invalid.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "InvalidEmails:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": \"The email addresses provided are invalid.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingHtmlFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while reading the email html file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorSendingEmails:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while sending the test emails. Please try again later.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "TaskExecutionErrorWithCode:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while executing the task. The task closed with error code '%code%'\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "TaskExecutionError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while executing the task.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "CompilationError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign configuration file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while reading the campaign data file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign structure file.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorSavingStructure:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while writing the file 'index-%lang%.html'.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRenderingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while rendering the campaign data files.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorSavingData:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": [\n             \"Something unexpected happened while writing the file  'lang-%lang%.yml'.\"\n         ]\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.email.js",
    "groupTitle": "Emails"
  },
  {
    "type": "put",
    "url": "/brands/:brandSlug/recipients",
    "title": "Update the recipients list",
    "name": "setRecipients",
    "group": "Emails",
    "description": "<p>Update the recipients list. Be aware, this function will overide all the recipients previously added to the brand.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Recipient[]",
            "optional": false,
            "field": "recipients",
            "description": "<p>New recipients list</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Recipient",
            "optional": false,
            "field": "Object",
            "description": "<p>New recipients list</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"firstname\": \"John\",\n        \"lastname\": \"Doe\",\n        \"email\": \"john.doe@domain.com\"\n    },\n    {...}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "WrongParameter",
            "description": "<p>Please send a recipient in the body parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorReadingRecipients",
            "description": "<p>Something unexpected happened while reading the brand recipients file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorWritingRecipients",
            "description": "<p>Something unexpected happened while writing the brand recipients file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "WrongParameter:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": \"Please send a recipient in the body parameters.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorReadingRecipients:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while reading the brand recipients file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorWritingRecipients:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Something unexpected happened while writing the brand recipients file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.email.js",
    "groupTitle": "Emails"
  },
  {
    "type": "delete",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/images",
    "title": "Delete an image",
    "name": "deleteImage",
    "group": "Images",
    "description": "<p>Delete an image by file name.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "imageFileName",
            "description": "<p>Image file name to be deleted from the campaign.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HttpRequestSuccess",
            "optional": false,
            "field": "Success",
            "description": "<p>Success 200</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "WrongParameters",
            "description": "<p>Please send the image url to be removed in the body parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorRemovingFile",
            "description": "<p>Couldn't remove the image. Either the image name, the brand name or the campaign name is incorrect.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "WrongParameters:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n {\n     \"error\": {\n         \"status\": 422,\n         \"message\": \"Please send the image url to be removed in the body parameters.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ErrorRemovingFile:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Couldn't remove the image. Either the image name, the brand name or the campaign name is incorrect.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.image.js",
    "groupTitle": "Images"
  },
  {
    "type": "post",
    "url": "/brands/:brandSlug/campaigns/:campaignSlug/images",
    "title": "Upload an image",
    "name": "uploadImage",
    "group": "Images",
    "description": "<p>Upload an image and return its public link.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "image",
            "description": "<p>Image to upload to the server.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Object",
            "description": "<p>Public link to the uploaded image</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    imageUrl: '/dist/brand/campaign/images/uploads/imageName.jpg'\n}",
          "type": "text"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "ErrorUpload",
            "description": "<p>An error occured when uploading the file.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "FormatInvalid",
            "description": "<p>Image format invalid or nothing was sent.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "MkDirError",
            "description": "<p>Could not create the image folder.</p>"
          },
          {
            "group": "Error 5xx",
            "type": "522",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after a few seconds.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorUpload:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"An error occured when uploading the file.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "FormatInvalid:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Image format invalid or nothing was sent.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "MkDirError:",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n     \"error\": {\n         \"status\": 500,\n         \"message\": \"Could not create the image folder.\"\n     }\n }",
          "type": "json"
        },
        {
          "title": "ConnectionTimeOut:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "BrandNotFound:",
          "content": "HTTP/1.1 404 Not Found\n {\n   \"error\": {\n      \"status\": 404,\n      \"message\": \"The brand '%brandName%' does not exist.\"\n   }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api.image.js",
    "groupTitle": "Images"
  }
] });
