var METADATA = {
  "mounts": {
    "site":    "//site.www.trunk.svn.freebase-delphi.googlecode.dev"
  }
};

acre.require(METADATA.mounts.site + "/lib/helper/helpers.sjs").extend_metadata(METADATA, "site");

delete METADATA.error_page;
delete METADATA.not_found_page;
