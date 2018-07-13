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
        "522": [
          {
            "group": "522",
            "type": "Object",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after 5 seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Timed-Out:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
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
        "522": [
          {
            "group": "522",
            "type": "Object",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after 5 seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Timed-Out:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
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
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "BrandNotFound",
            "description": "<p>The brand given in the url does not exist.</p>"
          }
        ],
        "522": [
          {
            "group": "522",
            "type": "Object",
            "optional": false,
            "field": "ConnectionTimeOut",
            "description": "<p>Connection Timed Out after 5 seconds.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Timed-Out:",
          "content": "HTTP/1.1 522 Connection Timed Out\n{\n  \"error\": {\n     \"status\": 522,\n     \"message\": \"Connection Timed Out.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Error-Brand-Not-Found:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": {\n     \"status\": 404,\n     \"message\": \"The brand '%brandName%' does not exist.\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  }
] });
