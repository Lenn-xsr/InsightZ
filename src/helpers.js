export function mapFields(options) {
  const object = {};

  for (let x = 0; x < options.fields.length; x++) {
    const field = [options.fields[x]];
    object[field] = {
      get() {
        return this.$store.state[options.base][field];
      },
      set(value) {
        this.$store.commit(options.mutation, { [field]: value });
      },
    };
  }

  return object;
}

export function concat(obj, entries) {
  Object.entries(entries).forEach((r) => {
    Object.entries(obj).filter((a) => {
      if (a[0] === r[0] && r[1] != a[1]) obj[a[0]] = r[1];
      else if (r[0]) obj[r[0]] = r[1];
    });
  });
  return obj;
}

export function normalizeString(string) {
  return string
    .replace(/[^A-Za-z0-9À-ú]+/g, "-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function urlify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}

export function convertMilliseconds(ms) {
  const segundos = ~~(ms / 1000);
  const minutos = ~~(segundos / 60);
  const horas = ~~(minutos / 60);
  const dias = ~~(horas / 24);

  return {
    dias,
    horas: horas % 24,
    minutos: minutos % 60,
    segundos: segundos % 60,
  };
}

export function formatTime(time, format = "dd:hh:mm:ss") {
  const formats = { dd: "dias", hh: "horas", mm: "minutos", ss: "segundos" };

  const newFormat = format
    .replace(/dd|hh|mm|ss/g, (match) =>
      time[formats[match]].toString().padStart(2, "0")
    )
    .replace(/^(00:)+/g, "");

  return newFormat.length > 2 ? newFormat : "00:" + newFormat;
}

export function convertToSeconds(time) {
  const timeSplit = time.split(":");
  return timeSplit[0] * 3600 + timeSplit[1] * 60 + Number(timeSplit[2]);
}
