//filters media from first pass of scraping
var filterMedia = function(a) {
  var title,
    href = a.getAttribute('href'),
    name = a.textContent.trim(),
    data = {
      type: "unknown",
      url: href,
      description: name
    };
  console.log(a);
  if (a.protocol === "javascript:") {
    if (a.getAttribute('onclick')){
      href = a.getAttribute('onclick').replace("window.open('", "").split("'")[0];
      data.url = href;
    } else { 
      return false;
    }
  }
  if (href.contains("pdf")) {
    data.type = "pdf";
  } else if (href.contains(".ram") || href.contains("fplayer")) {
    data.type = "video";
  } else if (name.contains("Congress")) {
    data.type = "filterOut";
  } else if (href.contains("witnessId") || a.textContent.contains("& Opening Statements")) {
    title = a.parentNode.textContent.replace(/\s+/g, ' ').trim();
    data.witnessId = URI(href).search(true).witnessId;
    console.log(data.witnessId);
    if (title.contains("Video") && !href.contains(".ram")) {
      data.type = "link";
      data.title = title;
    } else if (title.contains("Additional") || name.contains("Response") || ( name.contains("Statement") && !name.contains("Archived"))) {
      data.type = "link";
      data.title = title;
    } else {
      //Probably a witness!
      data.name = name.replace(" (Statements & Archived Video)", "").replace(" (Opening Statement and Archived Video)", "").replace(" (Statement and Archived Video)", "");
      data.title = title.trim().replace(name, "");
      data.testimonyURL = href;
      data.type = "witness";
    }
  } else {
    data.type = "link";
  }
  return data;
};

//filters media from second pass of scraping
var filterWitnesses = function(a) {
  var href = a.getAttribute('href'),
    name = a.textContent.trim(),
    media = {
      url: href.replace(/\n/g, ''),
      description: name
    };
  media.description = name;
  if (a.protocol === "javascript:") {
    if (a.getAttribute('onclick')){
      href = a.getAttribute('onclick').replace("window.open('", "").split("'")[0];
      media.url = href;
    } else { 
      return false;
    }
  }
  if (href.contains("void") || href.contains("<") || name.contains("Congress") || href === "http://www.senate.gov"){
    return false;
  }
  if (href.contains("pdf")) {
    media.type = "pdf";
  } else if (href.contains(".ram")) {
    //realvideo, yuck
    media.type = "video";
  } else if (name.contains("Congress")) {
    return name;
  } else if (href.contains("isvp")) {
    media.type = "video";
    media.filename = URI(media.url).search(true).filename;
    media.startTime = URI(media.url).search(true).stt;
    media.duration = URI(media.url).search(true).duration;
    
  } else if (href.contains("fplayers")){
    media.type = "video";
    media.filename = URI(media.url).search(true).fn;
    media.startTime = URI(media.url).search(true).st;
    media.duration = URI(media.url).search(true).dur;
  }
  return media;
  
};