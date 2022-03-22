export default {
  methods: {
    validity(arr) {
      const result = [];
      arr.forEach((e) => {
        const selected = document.querySelector(e);
        result.push(selected.validity.valid);
        if (!selected.validity.valid) selected.click();
      });
      return !result.includes(false);
    },
    sendAlert(msg, profile) {
      const alert = document.createElement("small"),
        inputs = document.querySelectorAll("input"),
        hasAlert = document.querySelector(".alert-error");

      if (hasAlert) return;

      alert.classList.add("alert-error");
      alert.innerText = msg;

      if (profile) inputs[0].after(alert);
      else inputs[inputs.length - 1].after(alert);
      setTimeout(() => alert.remove(), 10000);
    },
    sendPopupAlert(msg = "Erro no servidor", type) {
      const alert = document.createElement("small"),
        hasAlert = document.querySelector(`.alert-popup-${type}`);

      if (hasAlert) return (hasAlert.innerText = msg);

      alert.className = `fas alert-popup-${type}`;
      alert.innerText = msg;

      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 10000);
    },
  },
};
