var DateHelper = {
  // Takes the format of "Jan 15, 2007 15:45:00 GMT" and converts it to a relative time
  // Ruby strftime: %b %d, %Y %H:%M:%S GMT
  time_ago_in_words_with_parsing: function(from) {
    var date = new Date(); 
    date.setTime(Date.parse(from));
    return this.time_ago_in_words(date);
  },
  
  time_ago_in_words: function(from) {
    return this.distance_of_time_in_words(new Date(), from);
  },
 
  distance_of_time_in_words: function(to, from) {
    var distance_in_seconds = ((to - from) / 1000);
    var distance_in_minutes = Math.floor(distance_in_seconds / 60);
 
    if (distance_in_minutes == 0) { return L("twitter_time_lessminute"); }
    if (distance_in_minutes == 1) { return L("twitter_minuteago"); }
    if (distance_in_minutes < 45) { return distance_in_minutes + L("twitter_minutesago"); }
    if (distance_in_minutes < 90) { return L("twitter_hourago"); }
    if (distance_in_minutes < 1440) { return L("twitter_aboutnum") + Math.floor(distance_in_minutes / 60) + L("twitter_hoursago"); }
    if (distance_in_minutes < 2880) { return L("twitter_oneday"); }
    if (distance_in_minutes < 43200) { return Math.floor(distance_in_minutes / 1440) + L("twitter_daysago"); }
    if (distance_in_minutes < 86400) { return L("twitter_monthago"); }
    if (distance_in_minutes < 525960) { return Math.floor(distance_in_minutes / 43200) + L("twitter_monthsago"); }
    if (distance_in_minutes < 1051199) { return L("twitter_yearago"); }
 
    return L("twitter_over") + (distance_in_minutes / 525960).floor() + L("twitter_yearsago");


  }
};