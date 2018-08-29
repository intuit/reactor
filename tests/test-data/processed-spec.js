
export default {
  "name": "us regular",
  "metadata": {
    "region": "us",
    "segment": "items",
    "initialSegment": "items",
    "fallbackSegment": "404"
  },
  "navSpecs": [
    {
      "name": "item-list",
      "path": {
        "segment": "",
        "urlAccess": true
      },
      "views": [
        {
          "type": "main",
          "component": "item-list"
        }
      ],
      "transitions": [
        {
          "name": "process-items",
          "to": "decision-can-process-items",
          "attributes": [
            "canProcessItems"
          ]
        }
      ]
    },
    {
      "name": "decision-can-process-items",
      "type": "decision",
      "outcomes": [
        {
          "attribute": "canProcessItems",
          "value": true,
          "name": "yes"
        },
        {
          "attribute": "canProcessItems",
          "value": false,
          "name": "no"
        }
      ],
      "transitions": [
        {
          "name": "yes",
          "to": "process-items",
          "data": {
            "canProcessItems": undefined
          }
        },
        {
          "name": "no",
          "to": "item-list",
          "data": {
            "canProcessItems": undefined
          }
        }
      ]
    },
    {
      "name": "404",
      "path": {
        "segment": "404",
        "urlAccess": true
      },
      "views": [
        {
          "type": "main",
          "component": "404"
        }
      ]
    },
    {
      "name": "process-items",
      "type": "higher-order",
      "metadata": {
        "segment": "process-items",
        "entry": "process-items-preview"
      },
      "navSpecs": [
        {
          "name": "process-items-confirmation",
          "path": {
            "segment": "confirmation",
            "urlAccess": false,
            "fallbackSegment": "preview"
          },
          "views": [
            {
              "type": "main",
              "component": "process-items-confirmation"
            }
          ],
          "transitions": [
            {
              "name": "done",
              "escalate": "exit"
            }
          ]
        },
        {
          "name": "process-items-preview",
          "path": {
            "segment": "preview",
            "urlAccess": true
          },
          "views": [
            {
              "type": "main",
              "component": "process-items-preview"
            }
          ],
          "transitions": [
            {
              "name": "submit-process-items",
              "to": "process-items-confirmation"
            },
            {
              "name": "cancel",
              "escalate": "exit"
            }
          ]
        }
      ],
      "transitions": [
        {
          "name": "exit",
          "to": "item-list"
        }
      ]
    }
  ]
};
