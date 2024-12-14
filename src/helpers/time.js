import moment from "moment";
export const toSeconds = function (time) {
  const { hours, minutes } = time;
  return moment
    .duration({
      hours: parseInt(time.hours, 10),
      minutes: parseInt(time.minutes, 10),
    })
    .asSeconds();
};
