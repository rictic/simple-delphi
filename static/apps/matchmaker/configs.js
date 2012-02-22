var mode_configs = {

  recon : {
    message : "Select a topic that matches",
    buttons : [
      {
        "markup" : "<b>N</b>o Match",
        "key" : "n",
        "description" : "when there are no matches",
        "judgment" : "no_match",
        "training" : true
      },
      {
        "markup" : "Insufficient Info",
        "key" : ["space","s"],
        "description" : "when you think you don't have enough information to be give an answer without doubts",
        "judgment" : "insufficient_info",
        "training" : true
      },
      {
        "markup" : "<b>I</b>nvalid",
        "key" : "i",
        "description" : "when there is something wrong with the topic to reconcile (say a server error, or a file not found)",
        "style" : "font-size: 85%",
        "judgment" : "invalid",
        "training" : true
      }
    ]
  },

  dupes : {
    message : "Is there a dupe?",
    buttons : [
      {
        "markup" : "<b>N</b>o Dupes",
        "key" : "n",
        "description" : "when there are no duplicates",
        "judgment" : "no_dupe",
        "training" : true
      },
      {
        "markup" : "<b>M</b>any Dupes",
        "key" : "m",
        "description" : "when there are many duplicate topics",
        "judgment" : "many_dupes",
        "training" : true
      },
      {
        "markup" : "Not Sure",
        "key" : ["space","s"],
        "description" : "when you think you don't have enough information to be give an answer without doubts",
        "judgment" : "unsure",
        "training" : true
      },
      {
        "markup" : "<b>I</b>nvalid",
        "key" : "i",
        "description" : "when there is something wrong with the topic to reconcile (say a server error)",
        "style" : "font-size: 85%",
        "judgment" : "invalid",
        "training" : true
      }
    ]
  }
};
